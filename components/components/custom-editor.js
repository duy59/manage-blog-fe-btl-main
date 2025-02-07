// components/custom-editor.js
'use client' // only in App Router
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	ClassicEditor,
	Alignment,
	Autoformat,
	AutoLink,
	Autosave,
	BlockQuote,
	Bold,
	CKBox,
	CKBoxImageEdit,
	CloudServices,
	Essentials,
	FontSize,
	FontFamily,
	Heading,
	Highlight,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Italic,
	Link,
	List,
	MediaEmbed,
	Mention,
	Paragraph,
	PasteFromOffice,
	PictureEditing,
	RemoveFormat,
	Strikethrough,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	Underline,
	Undo,
    SourceEditing,
    ImageInsert
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import UploadImageAdapter from '../UploadImageAdapter'; // Import the custom file manager plugin

function  UploadImageAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadImageAdapter(loader);
    };
};
const CustomEditor = ({ content, setContent}) => {
    const editorPresenceRef = useRef( null );
	const editorContainerRef = useRef( null );
	const editorRef = useRef( null );
	const editorInstanceRef = useRef( null );
	const editorAnnotationsRef = useRef( null );
	const isLayoutReady = true;
    
    
	// useEffect( () => {
	// 	window.addEventListener( 'resize', refreshDisplayMode );
	// 	window.addEventListener( 'beforeunload', checkPendingActions );

	// 	return () => {
	// 		window.removeEventListener( 'resize', refreshDisplayMode );
	// 		window.removeEventListener( 'beforeunload', checkPendingActions );
	// 	};
	// }, [] );
    // prevent CKEditor from re-rendering when content changes

	const editorConfig = {
        extraPlugins : [UploadImageAdapterPlugin],
		plugins: [
			Alignment,
			Autoformat,
			AutoLink,
			Autosave,
			BlockQuote,
			Bold,
			CKBox,
			CKBoxImageEdit,
			CloudServices,
			Essentials,
			FontSize,
			FontFamily,
			Heading,
			Highlight,
			Image,
			ImageCaption,
			ImageResize,
			ImageStyle,
			ImageToolbar,
			ImageUpload,
			Italic,
			Link,
			List,
			MediaEmbed,
			Mention,
			Paragraph,
			PasteFromOffice,
			PictureEditing,
			RemoveFormat,
			Strikethrough,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			Underline,
			Undo,
            SourceEditing,
            ImageInsert

		],
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'heading',
				'|',
				'fontSize',
				'fontFamily',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'removeFormat',
				'|',
				'link',
				'insertImage',
				'mediaEmbed',
				'insertTable',
				'highlight',
				'blockQuote',
				'|',
				'alignment',
				'|',
				'bulletedList',
				'numberedList',
				'|',
                'sourceEditing',
				'accessibilityHelp'
			]
		},
		comments: {
			editorConfig: {
				extraPlugins: [ Bold, Italic, Underline, List, Autoformat ]
			}
		},
		fontFamily: {
			supportAllValues: true
		},
		fontSize: {
			options: [ 10, 12, 14, 'default', 18, 20, 22 ],
			supportAllValues: true
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph'
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1'
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2'
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3'
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4'
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5'
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6'
				}
			]
		},
		image: {
			toolbar: [ 'imageTextAlternative', '|', 'ckboxImageEdit' ]
		},
		mediaEmbed: {
			toolbar: [ 'comment' ]
		},
		menuBar: {
			isVisible: true
		},
		table: {
			contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties' ]
		},
		sidebar: {
			container: editorAnnotationsRef.current
		}
	};




	return (
		<>
			<div className="presence" ref={editorPresenceRef}></div>
			<div className="editor-container editor-container_classic-editor editor-container_include-annotations" ref={editorContainerRef}>
				<div className="editor-container__editor-wrapper">
					<div className="editor-container__editor">
						<div ref={editorRef}>{isLayoutReady &&
								<CKEditor
                                    data={content}
									editor={ClassicEditor}
									config={editorConfig}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContent(data);
                                        console.log({ event, editor, data });
                                      }}
									onReady={ editor => {
										editorInstanceRef.current = editor;
									} }
								/>
						}
						</div>
					</div>
					<div className="editor-container__sidebar">
						<div ref={editorAnnotationsRef}></div>
					</div>
				</div>
			</div>

		</>
	);
}

export default CustomEditor;