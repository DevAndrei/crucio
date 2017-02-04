class EditOralExamController {
  readonly API: API;
  FileUploader: any;
  $location: angular.ILocationService;
  $uibModal: angular.ui.bootstrap.IModalService;
  user: Crucio.User;
  oralExamId: number;
  numberChanged: number;
  uploader: any;
  hasChanged: boolean;
  oralExam: Crucio.OralExam;
  ready: boolean;
  isSaving: boolean;

  constructor(Page: Page, Auth: Auth, API: API, FileUploader, $scope: angular.IScope, $location: angular.ILocationService, $stateParams, $uibModal: angular.ui.bootstrap.IModalService) {
    this.API = API;
    this.FileUploader = FileUploader;
    this.$location = $location;
    this.$uibModal = $uibModal;

    Page.setTitleAndNav('Mündliche Prüfung | Crucio', 'Author');

    this.user = Auth.getUser();
    this.oralExamId = $stateParams.oralExamId;
    this.numberChanged = -1; // Works with this number...

    this.uploader = new FileUploader({ url: '/api/v1/file/upload' });
    this.uploader.onSuccessItem = (fileItem, response) => {
      this.oralExam.filename = response.upload_name;
    };


    $scope.$watch(() => this.oralExam, () => {
      this.hasChanged = (this.numberChanged > 0);
      this.numberChanged += 1;
    }, true);

    $scope.$on('$locationChangeStart', event => {
      if (this.hasChanged) {
        const confirmClose = confirm(
          'Die Änderungen an der Prüfung bleiben dann ungespeichert. Wirklich verlassen?'
        );
        if (!confirmClose) {
          event.preventDefault();
        }
      }
    });

    this.loadOralExam();
  }

  loadOralExam(): void {
    this.API.get(`oral_exams/${this.oralExamId}`).then(result => {
      this.oralExam = result.data.oral_exam;
      this.ready = true;
    });
    this.ready = true;
  }

  saveOralExam(): void {
    const validate = this.oralExam.semester >= 0
      && this.oralExam.semester <= 1;

    if (validate) {
      this.isSaving = true;
      this.API.put(`oral_exams/${this.oralExamId}`, this.oralExam).then(result => {
        if (!result.data.status) {
          alert('Fehler beim Speichern der Klausur.');
        }

        this.hasChanged = false;
        this.numberChanged = 0;
        this.isSaving = false;
      });
    } else {
      alert('Es fehlen noch allgemeine Infos zur Klausur.');
    }
  }

  deleteOralExamModal(): void {
    this.$uibModal.open({
      component: 'deleteOralExamModalComponent',
      resolve: {
        oralExamId: () => this.oralExamId,
      },
    });
  }
}

angular.module('crucioApp').component('editoralexamcomponent', {
  templateUrl: 'app/author/edit-oral-exam/edit-oral-exam.html',
  controller: EditOralExamController,
});
