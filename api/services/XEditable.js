
/*
	Service to work with library X-Editable.

	Used for X-Editable posts

	POST /post
	{
	    name:  'username',  //name of field (column in db)
	    pk:    1            //primary key (record id)
	    value: 'superuser!' //new value
	}
*/
exports.handle = function(model) {
	return function(req, res, next){
		// console.log('update_x_editable'.red);
		var id = req.param('pk') || req.param('id');
		var key = req.param('name') || req.param('key');
		var value = req.param('value') || null;

		if(!id || !key){
			return next('Id or Key are missing');
		}

		var Model = model;
		if(!Model){
			return next();
			return next('There is a problem with the model!');
		}

		clonedParams = {};
		clonedParams[key] = value;

		Model.update(id, clonedParams, function(err, models) {
			if(err) return next(err);
			if(!models || models.length === 0) return next();

			// Because this should only update a single record and update
			// returns an array, just use the first item
			var model = models[0];

			// If the model is silent, don't use the built-in pubsub
			// (also ignore pubsub logic if the hook is not enabled)
			// if (sails.hooks.pubsub && !Model.silent) {
				// Model.publishUpdate(model.id, model.toJSON(), req.socket);
			// }

			return res.send(model);
		});
	}
}
