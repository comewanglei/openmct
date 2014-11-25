/*global define*/


define(
    function () {
        'use strict';

        /**
         * The "Save" action; the action triggered by clicking Save from
         * Edit Mode. Exits the editing user interface and invokes object
         * capabilities to persist the changes that have been made.
         */
        function SaveAction($location, context) {
            var domainObject = context.domainObject;

            // Look up the object's "editor.completion" capability;
            // this is introduced by EditableDomainObject which is
            // used to insulate underlying objects from changes made
            // during editing.
            function getEditorCapability() {
                return domainObject.getCapability("editor");
            }

            // Invoke any save behavior introduced by the editor.completion
            // capability.
            function doSave(editor) {
                return editor.save();
            }

            // Discard the current root view (which will be the editing
            // UI, which will have been pushed atop the Browise UI.)
            function returnToBrowse() {
                $location.path("/browse");
            }

            return {
                /**
                 * Save changes and conclude editing.
                 *
                 * @returns {Promise} a promise that will be fulfilled when
                 *          cancellation has completed
                 */
                perform: function () {
                    return doSave(getEditorCapability()).then(returnToBrowse);
                }
            };
        }

        /**
         * Check if this action is applicable in a given context.
         * This will ensure that a domain object is present in the context,
         * and that this domain object is in Edit mode.
         * @returns true if applicable
         */
        SaveAction.appliesTo = function (context) {
            var domainObject = (context || {}).domainObject;
            return domainObject !== undefined &&
                domainObject.hasCapability("editor");
        };

        return SaveAction;
    }
);