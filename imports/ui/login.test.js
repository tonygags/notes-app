import { Metoer } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { mount } from 'enzyme';

import { Login } from './Login';

if (Meteor.isClient) {
    describe('Login', function () {
        it('should show error messages', function () {
            const error = 'This is not working';
            //Instance Login
            const wrapper = mount(<Login loginWithPassword={() => {}} />);

            wrapper.setState({ error });
            expect(wrapper.find('p').text()).toBe(error);

            wrapper.setState({ error: '' });
            expect(wrapper.find('p').length).toBe(0)

        });

        it('should call loginWithPassword with form data', function () {
            const email = "tony@test.com";
            const password = 'password123';
            const spy = expect.createSpy();
            const wrapper = mount(< Login loginWithPassword={spy} />);

            wrapper.ref('email').node.value = email;
            wrapper.ref('password').node.value = password;
            wrapper.find('form').simulate('submit');

            expect(spy.calls[0].arguments[0]).toEqual({ email });

            //Check that the second password is the password from above
            expect(spy.calls[0].arguments[1]).toBe(password);
        });

        it('should set loginWithPassword callback errors', function () {
            const spy = expect.createSpy();
            const wrapper = mount(< Login loginWithPassword={spy} />);

            wrapper.find('form').simulate('submit');

            spy.calls[0].arguments[2]({});
            expect(wrapper.state('error').length).toNotBe(0);

            // Call the third argument with no arguments
            spy.calls[0].arguments[2]();
            expect(wrapper.state('error').length).toBe(0);
        
        });


    });
}