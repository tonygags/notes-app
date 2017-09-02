import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

export const Notes = new Mongo.Collection('notes');

if (Meteor.isServer) {
    Meteor.publish('notes', function () {
        return Notes.find({ userId: this.userId });
    });
}

Meteor.methods({
    //Check if userId exists
    'notes.insert'() {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        return Notes.insert({
            title: '',
            body:'',
            userId: this.userId,
            updatedAt: moment().valueOf() //new Date().getTime()
        });
    },
    'notes.remove'(_id) {
        //Validate userId
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        //Validate _id is a String and >= 1 with Simple Schema
        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            }
        }).validate({ _id});

        //Remove the note
        Notes.remove({ _id, userId: this.userId });
    },
    'notes.update'(_id, updates) {
        //Validate userId
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        new SimpleSchema({
            _id: {
              type: String,
              min: 1
            },
            title: {
              type: String,
              optional: true
            },
            body: {
              type: String,
              optional: true
            }
          }).validate({
            _id,
            ...updates
          });
      
          Notes.update({
            _id,
            userId: this.userId
          }, {
            $set: {
            updatedAt: moment().valueOf(),
            ...updates
            }
        });
    }
});
