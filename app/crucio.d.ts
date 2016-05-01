interface User {
  active: number;
  course_id: number;
  email: string;
  group_id: number;
  group_name?: string;
  highlightExams: number;
  last_sign_in: number;
  password: string;
  remember_me: string;
  remember_user?: boolean;
  semester: number;
  showComments: number;
  useAnswers: number;
  useTags: number;
  user_id: number;
  username: string;
}

interface Exam {
  exam_id: number;
  file_name: string;
  subject_id: number;
  semester: number;
  date: string;
}

interface Comment {
  comment_id: number;
  comment: string;
  reply_to: number;
  date: number;
  question?: string;
  voting?: number;
  user_voting?: number;
}

interface Question {
  question_id?: number;
  question: string;
  correct_answer: number;
  type: number;
  question_image_url?: string;
  explanation?: string;
  category_id: number;
  answers: string[];
}

interface Storage {
  crucioCollection: any;
}

interface AnalyseCount {
  correct: number;
  wrong: number;
  seen: number;
  solved: number;
  free: number;
  no_answer: number;
  all: number;
  worked: number;
}
