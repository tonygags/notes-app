import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';

import { Editor } from './Editor';
import { notes } from '../fixtures/fixtures';

if (Meteor.isClient) {
    describe('Editor', function () {
        let browserHistory;
        let call;

        beforeEach(function () {
            call = expect.createSpy();
            browserHistory = {
                push: expect.createSpy()
            };
        });

        it('should render pick note message', function () {
            const wrapper = mount(<Editor browserHistory={browserHistory} call={call} />)
            expect(wrapper.find('p').text()).toBe('Pick or create a note to get started.')
        });

        it('should render not found message', function () {
            const wrapper = mount(<Editor browserHistory={browserHistory} call={call} selectedNoteId={notes[0]._id} />)
            expect(wrapper.find('p').text()).toBe('Note not found.')
        });

        it('should remove the note', function () {
            const wrapper = mount(<Editor browserHistory={browserHistory} call={call} selectedNoteId={notes[0]._id} note={notes[0]}/>)
            wrapper.find('button').simulate('click');
            expect(browserHistory.push).toHaveBeenCalledWith('/dashboard');
            expect(call).toHaveBeenCalledWith('notes.remove', notes[0]._id);
        });

        it('should update the note body on textarea change', function () {
            const newBody = 'This is my new body text';
            const wrapper = mount(<Editor browserHistory={browserHistory} call={call} selectedNoteId={notes[0]._id} note={notes[0]}/>);
      
            wrapper.find('textarea').simulate('change', {
              target: {
                value: newBody
              }
            });
      
            expect(wrapper.state('body')).toBe(newBody);
            expect(call).toHaveBeenCalledWith('notes.update', notes[0]._id, { body: newBody });
          });

    });
}