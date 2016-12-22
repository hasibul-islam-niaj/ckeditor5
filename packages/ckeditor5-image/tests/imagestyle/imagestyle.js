/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import ClassicTestEditor from 'tests/core/_utils/classictesteditor.js';
import ImageStyle from 'ckeditor5/image/imagestyle/imagestyle.js';
import ImageStyleEngine from 'ckeditor5/image/imagestyle/imagestyleengine.js';
import ButtonView from 'ckeditor5/ui/button/buttonview.js';

describe( 'ImageStyle', () => {
	let editor;
	const styles =  [
		{ name: 'style 1', title: 'Style 1 title', icon: 'style1-icon', value: null },
		{ name: 'style 2', title: 'Style 2 title', icon: 'style2-icon', value: 'style2', cssClass: 'style2-class' },
		{ name: 'style 3', title: 'Style 3 title', icon: 'style3-icon', value: 'style3', cssClass: 'style3-class' }
	];

	beforeEach( () => {
		const editorElement = document.createElement( 'div' );
		document.body.appendChild( editorElement );

		return ClassicTestEditor.create( editorElement, {
			plugins: [ ImageStyle ],
			image: {
				styles
			}
		} )
		.then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	it( 'should be loaded', () => {
		expect( editor.plugins.get( ImageStyle ) ).to.be.instanceOf( ImageStyle );
	} );

	it( 'should load ImageStyleEngine plugin', () => {
		expect( editor.plugins.get( ImageStyleEngine ) ).to.be.instanceOf( ImageStyleEngine );
	} );

	it( 'should register buttons for each style', () => {
		const command = editor.commands.get( 'imagestyle' );
		const spy = sinon.spy( editor, 'execute' );

		for ( let style of styles ) {
			const buttonView =  editor.ui.componentFactory.create( style.name );

			expect( buttonView ).to.be.instanceOf( ButtonView );
			expect( buttonView.label ).to.equal( style.title );
			expect( buttonView.icon ).to.equal( style.icon );

			command.isEnabled = true;
			expect( buttonView.isEnabled ).to.be.true;
			command.isEnabled = false;
			expect( buttonView.isEnabled ).to.be.false;

			buttonView.fire( 'execute' );
			sinon.assert.calledWithExactly( editor.execute, 'imagestyle', { value: style.value } );

			spy.reset();
		}
	} );
} );
