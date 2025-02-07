import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import fileIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'; // Use an appropriate icon

export default class CustomFileManagerPlugin extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('fileManager', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Insert File',
                icon: fileIcon,
                tooltip: true
            });

            // Callback executed once the file manager button is clicked.
            view.on('execute', () => {
                // Open your custom file manager here
                // For example, you can use a modal or a new window
                const fileUrl = prompt('Enter the file URL'); // Replace with your file manager logic

                if (fileUrl) {
                    editor.model.change(writer => {
                        const imageElement = writer.createElement('image', {
                            src: fileUrl
                        });

                        // Insert the image in the current selection location.
                        editor.model.insertContent(imageElement, editor.model.document.selection);
                    });
                }
            });

            return view;
        });
    }
}