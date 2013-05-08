var _ = require('underscore')._,
    Backbone = require('backbone');

var Models = {};

var Label = Models.Label = Backbone.Model.extend({
	defaults: {
		id: null,
		name: null
	}
});

var Labels = Models.Labels = Backbone.Collection.extend({
	model: Label,
	getList: function (id) {
		return this.toJSON();
	},
	addLabel: function (attrs) {
		this.push(new Label(attrs));
	}
});	
	
var SimpleModel = Models.SimpleModel = Backbone.Model.extend({

	defaults: {
		id: null,
		name: '',
		time: null,
        labels: new Labels()
	}

});	

var SimpleCollection = Models.SimpleCollection = Backbone.Collection.extend({

	ds: [],

	getList: function (id) {
		return this.toJSON();
	},

	addDatasource: function (source, collection) {
		var type = (source.indexOf('http')>=0) ? 'mongodb' : 'dirty';
		var reference, contentdb;
		var self = this;
		switch (type) {
			case 'dirty':
				var contentdb = require('dirty');
				reference = contentdb(source);
				reference.on('load', function() {
					self.set(reference.get(collection));
				});
				break;
			case 'mongodb':
				// http://paulallies.wordpress.com/2012/03/05/rest-based-service-with-nodejs-expressjs-and-mongodb/
				var contentdb = require('mongojs').connect(source);
				var reference = contentdb.collection(collection); // get a handle on the collection within the database
				break;
		}
		this.ds.push({
			type: type,
			ref: reference,
			collection: collection
		});
	},
		
	saveAll: function () {
		return this.ds;
	},
	
	fetchFromDatasource: function (ds, callback) {
		var coll = [];
		var self = this;
        if (ds.type == 'mongodb') {
            ds.ref.find().forEach(function(err, doc) {
                if(err){
                    console.error(err);
                    res.send('Oops!: ' + err);
                    return;
                }
                if (!doc) {
                    // When all the documents in the collection has been visited, output the result.
                    self.set(coll);
                    if (callback) callback(coll);
                    return;
                }
                //add the current doc in the loop to the result
                coll.push(doc);
            });
        } else if (ds.type == 'dirty') {
            this.set(ds.ref.get(ds.collection));
            if (callback) callback(coll);
        }
    },

    fetchAll: function (callback) {
        for (var i=0; i<this.ds.length; i++) {
            this.fetchFromDatasource(this.ds[i], callback);
        }
	},
	
	addModel: function (attrs) {
		this.push(new SimpleModel(attrs));
	}

});

module.exports = new SimpleCollection();
module.exports.SimpleModel = SimpleModel;