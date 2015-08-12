angular.module('mjTables').

    factory('TextAngularService', [function(){

        return {
            getConfig: getConfig
        };

        function getConfig(){
            return [
                ['h1', 'h2', 'h3', 'p', 'pre', 'quote'],
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['html', 'insertImage','insertLink']
            ];
        }
    }]);