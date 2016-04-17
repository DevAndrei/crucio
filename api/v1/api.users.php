<?php

$app->group('/users', function() {

    $this->get('', function($request, $response, $args) {
        $mysql = init();
        $query_params = $request->getQueryParams();

        $limit = $query_params['limit'] ? intval($query_params['limit']) : 10000;
        $query = strlen($query_params['query']) > 0 ? '%'.$query_params['query'].'%' : null;

        $stmt = $mysql->prepare(
		    "SELECT u.*, g.name AS 'group_name'
		    FROM users u
		    INNER JOIN groups g ON g.group_id = u.group_id
		    WHERE u.group_id = IFNULL(:group_id, u.group_id)
		        AND u.semester = IFNULL(:semester, u.semester)
		        AND ( u.username LIKE IFNULL(:query, u.username)
		            OR u.email LIKE IFNULL(:query, u.email) )
		    ORDER BY g.name ASC, u.user_id DESC
		    LIMIT :limit"
		);
		$stmt->bindValue(':group_id', $query_params['group_id']);
		$stmt->bindValue(':semester', $query_params['semester']);
		$stmt->bindValue(':query', $query);
		$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

        $data['users'] = getAll($stmt);
		return createResponse($response, $data);
	});

    $this->get('/distinct', function($request, $response, $args) {
		$mysql = init();

		$stmt_groups = $mysql->prepare(
		    "SELECT DISTINCT g.*
		    FROM groups g
		    ORDER BY g.name ASC"
		);

		$stmt_semesters = $mysql->prepare(
		    "SELECT DISTINCT u.semester
		    FROM users u
		    ORDER BY u.semester ASC"
		);

        $data['groups'] = getAll($stmt_groups);
		$data['semesters'] = getAll($stmt_semesters);
		return createResponse($response, $data);
	});

	$this->get('/login', function($request, $response, $args) {
		$mysql = init();
		$query_params = $request->getQueryParams();

		$email = str_replace('(@)', '@', $query_params['email']);
		$password = $query_params['password'];
		$remember_choice = !empty($query_params['remember_me']) ? $query_params['remember_me'] : 0;

		if (!$email) {
		    $data['error'] = 'error_no_email';
		    return createResponse($response, $data);
        }

        if (!$password) {
            $data['error'] = 'error_no_password';
            return createResponse($response, $data);
        }

		if (!getCount($mysql, "users WHERE email = ?", [$email])) {
	    	$data['error'] = 'error_incorrect_password';
	    	return createResponse($response, $data);
	    }

    	$user = fetchUserDetailsByMail($mysql, $email);

    	if ($user['active'] == 0) {
    		$data['error'] = 'error_account_not_activated';
    		return createResponse($response, $data);
    	}

		$entered_pass = generateHash($password, $user['password']);
		if ($entered_pass != $user['password']) {
			$data['error'] = 'error_incorrect_password';
			return createResponse($response, $data);
		}

        $user['display_username'] = $user['username'];
        $user['clean_username'] = $user['username_clean'];
        $user['hash_pw'] = $user['password'];
        $user['remember_me'] = $remember_choice;

		$stmt = $mysql->prepare(
		    "UPDATE users
		    SET last_sign_in = :last_sign_in
		    WHERE user_id = :user_id"
		);
		$stmt->bindValue(':last_sign_in', time());
		$stmt->bindValue(':user_id', $user['user_id']);

		$data['status'] = execute($stmt);
		$data['logged_in_user'] = $user;
		return createResponse($response, $data);
	});

	$this->get('/{user_id}', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "SELECT u.*, g.name AS 'group_name'
		    FROM users u
		    INNER JOIN groups g ON g.group_id = u.group_id
		    WHERE u.user_id = :user_id"
		);
		$stmt->bindValue(':user_id', $args['user_id'], PDO::PARAM_INT);

		$data['users'] = getAll($stmt);
		return createResponse($response, $data);
	});

    $this->post('', function($request, $response, $args) {
        $mysql = init();
        $body = $request->getParsedBody();

        $username = $body['username'];
        $email = str_replace('(@)', '@', sanitize($body['email']));
        $clean_password = $body['password'];
        $clean_username = sanitize($username);
        $semester = $body['semester'];
        $course_id = $body['course'];
        $activation_token = 0;

        if (!$username) {
            $data['error'] = 'error';
            return createResponse($response, $data);
        }

        if (getCount($mysql, "users WHERE username_clean = ?", [sanitize($clean_username)])) {
            $data['error'] = 'error_username_taken';
            return createResponse($response, $data);
        }

        if (getCount($mysql, "users WHERE email = ?", [sanitize($email)])) {
            $data['error'] = 'error_email_taken';
            return createResponse($response, $data);
        }

        $pattern = '/[\wäüöÄÜÖ]*@studserv\.uni-leipzig\.de$/';
        if (!preg_match($pattern, $email)) {
            if (!validateEMail($mysql, $email)) { // Check whitelist
                $data['error'] = 'error_email_forbidden';
                return createResponse($response, $data);
            }
        }

		$secure_pass = generateHash($clean_password);
		$activation_token = generateActivationToken($mysql);

        $website_url = getURL();
		$activation_message = $website_url.'activate-account?token='.$activation_token;
		$hooks = [
    		'ACTIVATION-MESSAGE' => $activation_message,
    		'ACTIVATION-KEY' => $activation_token,
    		'USERNAME' => $username,
        ];
        sendTemplateMail('new-registration', $email, 'Willkommen bei Crucio', $hooks);

        $stmt = $mysql->prepare(
		    "INSERT INTO users (username, username_clean, password, email, activationtoken, last_activation_request, sign_up_date, course_id, semester)
		    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
		);
		$stmt->bindValue(1, $username);
		$stmt->bindValue(2, $clean_username);
		$stmt->bindValue(3, $secure_pass);
		$stmt->bindValue(4, $email);
		$stmt->bindValue(5, $activation_token);
		$stmt->bindValue(6, time());
		$stmt->bindValue(7, time());
		$stmt->bindValue(8, $course_id);
		$stmt->bindValue(9, $semester);

		$data['status'] = $body; // execute($stmt);
        return createResponse($response, $data);
	});

	$this->put('/activate', function($request, $response, $args) {
        $body = $request->getParsedBody();
        $data = activate($body['token']);
	    return createResponse($response, $data);
	});

	$this->put('/change-semester', function($request, $response, $args) {
    	$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
    		"UPDATE users
    		SET semester = semester + :add"
        );
        $stmt->bindValue(':add', $body['number'], PDO::PARAM_INT);

        $data['status'] = execute($stmt);
		return createResponse($response, $data);
	});

	$this->put('/{user_id}/account', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$user_id = $args['user_id'];
		$email = str_replace('(@)', '@', sanitize($body['email']));

		$stmt_user = $mysql->prepare(
		    "SELECT u.*
		    FROM users u
		    WHERE u.user_id = :user_id
		    LIMIT 1"
		);
		$stmt_user->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $user = getFetch($stmt_user);
		$old_email = $user['email'];

		if ((getCount($mysql, "users WHERE email = ?", [sanitize($email)]) > 0) && $email != $old_email) {
			$data['error'] = 'error_email_taken';
			return createResponse($response, $data);
        }

		$stmt = $mysql->prepare(
		    "UPDATE users
		    SET email = ?, semester = ?, course_id = ?
		    WHERE user_id = ?"
		);
		$stmt->bindValue(1, $email);
		$stmt->bindValue(2, $body['semester']);
		$stmt->bindValue(3, $body['course_id']);
		$stmt->bindValue(4, $user_id, PDO::PARAM_INT);

		$data['status'] = execute($stmt);
	    return createResponse($response, $data);
	});

	$this->put('/{user_id}/password', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$user_id = $args['user_id'];

		$stmt_user = $mysql->prepare(
		    "SELECT u.*
		    FROM users u
		    WHERE u.user_id = :user_id
		    LIMIT 1"
		);
		$stmt_user->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $user = getFetch($stmt_user);

		$old_hash_pw = $user['password'];
	    $entered_pass = generateHash($body['current_password'], $old_hash_pw);
	    $entered_pass_new = generateHash($body['password'], $old_hash_pw);

	    if ($entered_pass != $old_hash_pw) {
	        $data['error'] = 'error_incorrect_password';
	        return createResponse($response, $data);
	    }

	    if ($entered_pass_new == $old_hash_pw) {
	        $data['error'] = 'error_same_passwords';
	        return createResponse($response, $data);
	    }

    	$secure_pass = generateHash($body['password']);

    	$stmt = $mysql->prepare(
		    "UPDATE users
		    SET password = :password
		    WHERE user_id = :user_id"
		);
		$stmt->bindValue(':password', $secure_pass);
		$stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);

		$data['status'] = execute($stmt);
	    return createResponse($response, $data);
	});

	$this->put('/{user_id}/settings', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "UPDATE users
		    SET highlightExams = ?, showComments = ?, repetitionValue = ?, useAnswers = ?, useTags = ?
		    WHERE user_id = ?"
		);
		$stmt->bindValue(1, $body['highlightExams']);
		$stmt->bindValue(2, $body['showComments']);
		$stmt->bindValue(3, $body['repetitionValue']);
		$stmt->bindValue(4, $body['useAnswers']);
		$stmt->bindValue(5, $body['useTags']);
		$stmt->bindValue(6, $args['user_id']);

        $data['status'] = execute($stmt);
		return createResponse($response, $data);
	});

	$this->put('/{user_id}/group', function($request, $response, $args) {
		$mysql = init();
		$body = $request->getParsedBody();

		$stmt = $mysql->prepare(
		    "UPDATE users
		    SET group_id = :group_id
		    WHERE user_id = :user_id"
		);
		$stmt->bindValue(':group_id', $body['group_id']);
		$stmt->bindValue(':user_id', $args['user_id']);

        $data['status'] = execute($stmt);
		return createResponse($response, $data);
	});

	$this->group('/password', function() {

        $this->post('/token', function($request, $response, $args) {
            $mysql = init();
			$body = $request->getParsedBody();

			if (!validateActivationToken($mysql, $body['token'])) {
				$data['error'] = 'error_token';
				return createResponse($response, $data);
			}

			$rand_pass = $body['password'];
			$secure_pass = generateHash($rand_pass);
			$user = fetchUserDetailsByToken($mysql, $body['token']);

			$new_activation_token = generateActivationToken($mysql);

			$stmt = $mysql->prepare(
    		    "UPDATE users
    		    SET password = ?, activationtoken = ?
    		    WHERE activationtoken = ?"
    		);
    		$stmt->bindValue(1, $secure_pass);
    		$stmt->bindValue(2, $new_activation_token);
    		$stmt->bindValue(3, sanitize($body['token']));

    		$data['status'] = execute($stmt);
			$data['status_flag'] = flagLostpasswordRequest($mysql, $user["username_clean"], 0);
			return createResponse($response, $data);
		});

		$this->post('/reset', function($request, $response, $args) {
			$mysql = init();
			$body = $request->getParsedBody();

			$email = str_replace('(@)', '@', $body['email']);

			if (!getCount($mysql, "users WHERE email = ?", [sanitize($email)])) {
				$data['error'] = 'error_email';
				return createResponse($response, $data);
            }

		    $user = fetchUserDetailsByMail($mysql, $email);

		    if ($user['LostpasswordRequest'] == 1) {
		        $data['error'] = 'error_already_requested';
		        return createResponse($response, $data);
		    }

	        $website_url = getURL();
	        $reset_url = $website_url.'change-password?token='.$user['activationtoken'];

	        $hooks = [
    	        'USERNAME' => $user['username'],
                'RESET-URL' => $reset_url,
            ];
	        sendTemplateMail('lost-password-request', $email, 'Passwort vergessen...', $hooks);

	        $data['status'] = flagLostpasswordRequest($mysql, $user['username'], 1);
			return createResponse($response, $data);
		});
	});

	$this->delete('/test-account', function($request, $response, $args) {
		$mysql = init();

		$stmt = $mysql->prepare(
		    "DELETE
		    FROM users
		    WHERE email = 'siasola@gmail.com'"
		);

        $data['status'] = execute($stmt);
		return createResponse($response, $data);
	});
});

?>
