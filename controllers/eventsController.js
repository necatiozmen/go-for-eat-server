'use strict';

const config = require('../config.js');
const monk = require('monk');
const db = monk(process.env.MONGOLAB_URI);
// TODO change monk endpoint

const Events = db.get('events');
const User = db.get('users');


// This module expects an object with all the data for creating a new event

//TODO verify if value can be array

module.exports.createEvent = async (ctx, next) => {
	if ('POST' != ctx.method) return await next();
	const newEvent = {
		place_id: ctx.request.body.place_id,
		place_name: ctx.request.body.place_name,
		place_address: ctx.request.body.place_address,
		location: ctx.request.body.location,
		when: ctx.request.body.when,
		creator: ctx.user._id,
		attendees: [ctx.user._id],
	};
	try {
    const event = await Events.insert(newEvent);
		ctx.status = 200;
    ctx.body = JSON.stringify({'event': event});
	} catch (e) { console.log('Event create error: ', e);}
	ctx.status = 400;
};

// Edit event module:
// take the complete event params from request body
module.exports.editEvent = async (ctx, next) => {
	if ('PUT' != ctx.method) return await next();
  try {
    await Events.updateOne({ _id: ctx.request.body._id }), { $set: {
      place_id: ctx.request.body.place_id,
      place_name: ctx.request.body.place_name,
      place_address: ctx.request.body.place_address,
      location: ctx.request.body.location,
      when: ctx.request.body.when,
    }};
    let event = await Events.findOne({ _id: ctx.params._id });
    ctx.body = JSON.stringify({'event': event});
    ctx.status = 200;
  } catch (e) { console.log('Modify create error: ', e); }
};

// Delete event
// uses the ID parsed from the uri
module.exports.deleteEvent = async (ctx, next) => {
	if ('DELETE' != ctx.method) return await next();
  try {
    await Events.remove({ _id: ctx.params.id});
    ctx.status = 204;
  } catch(e) { console.log('Deleting event error: ', e);}
};

// GET event informations

// TODO is it Event.get ?
module.exports.getEvent = async (ctx, next) => {
	if ('GET' != ctx.method) return await next();
	const event = await Events.findOne({ _id: ctx.params.id });
	if (event) {
		ctx.status = 200;
		ctx.body = event;
	} else {
		ctx.status = 404;
		ctx.body = 'The event does not exist';
	}
};

module.exports.joinEvent = async (ctx, next) => {
if ('PUT' != ctx.method) return await next();
	try {
		await Events.update({ email: userData.email }, {
			'name': userData.name,
			'email': userData.email,
			'accessToken': userData.accessToken,
			'profile_picture': userData.profile_picture
		});
		// console.log('update user');
		return User.findOne({ email: userData.email });
	} catch (e) { console.error('Update user error', e); }
};

module.exports.leaveEvent = async (ctx, next) => {
	if ('GET' != ctx.method) return await next();

};

module.exports.getEvents = async (ctx, next) => {
};