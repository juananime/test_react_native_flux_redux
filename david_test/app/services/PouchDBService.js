import {
    AsyncStorage
} from 'react-native';
import _ from 'lodash';
import PouchDB from 'pouchdb-react-native';
PouchDB.plugin(require('pouchdb-find'));

const localDB = 'RFDI';
const PouchDBService = {};
const DB = new PouchDB(localDB);


PouchDBService.setMaps = () => {

    DB.get('_design/tags_by_area').then(function (doc) {
        DB.remove('_design/tags_by_area', doc._rev);
      console.log('_design', doc);
    }).catch(function (err) {
        const ddoc = {
          _id: '_design/tags_by_area',
          views: {
            "tags-area": {
              map: function (doc) {
                  if (doc.doctype == 'tag'){
                      emit( [doc.currentareaid, doc.currentaction], 1);
                  }
              },
              reduce: "_count"
            }
          }
        };
        // DB.put(ddoc).then(function () {
        //   // success!
        // }).catch(function (err) {
        //   console.log('_design/tags_by_area', err);
        // });
    });

    DB.get('_design/tags_by_area_no_action').then(function (doc) {
      console.log('_design', doc);
        DB.remove('_design/tags_by_area_no_action', doc._rev);
    }).catch(function (err) {
        const ddoc2 = {
          _id: '_design/tags_by_area_no_action',
          views: {
            "tags-area-na": {
              map: function (doc) {
                  if (doc.doctype == 'tag'){
                      emit(doc.currentareaid, { currentareaid: doc.currentareaid, currentaction: doc.currentaction });
                  }
              }.toString()
            }
          },
          "language": "javascript"
        };
        // DB.put(ddoc2).then(function () {
        //   // success!
        // }).catch(function (err) {
        //   console.log('_design/tags_by_area_no_action', err);
        // });
    });
};

PouchDBService.connect = (dbUser, callback) => { // , callback
    const setsyncURL = `https://fabacus:fabacus2016@fabacus.cloudant.com/${dbUser.toLowerCase()}`;
    const remoteDb = new PouchDB(setsyncURL, { ajax: { cache: false } });
    console.log('CONNNECTIOND DONE')
    DB.sync(remoteDb, {live: true, retry: true, continuous: true,}).on('complete', function () {
        callback();

        DB.createIndex({
            index: {
                fields: ['doctype','tagid','_id'],
                name: 'myindex',
                ddoc: 'mydesigndoc',
                type: 'json',
            }
        });
        console.log('synced');
    }).on('error', function (err) {
       console.log('ERR sync ', err.message);
    });
};

// PouchDBService.setMaps();

PouchDBService.storeLocations = (locations, callback) => {

    locations._id = 'locations_'+(new Date).getTime();

    DB.put(locations);
};

PouchDBService.fetchLocations = (callback) => {
    DB.find({
        selector: { doctype: 'location' }
    }).then(function (result) {

        console.log('locations ====> ',result)
        callback(result);
        // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.fetchItems = (callback) => {

    DB.find({
        selector: { doctype: 'item' }
    }).then(function (result) {
        callback(result);
        // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.updateItemsVariant = (items, callback) =>{
    DB.bulkDocs(
        items
    ).then(function () {
        return DB.allDocs({include_docs: true});
    }).then(function (result) {
        console.log('resulllltt :;: '+JSON.stringify(result));
        PouchDBService.fetchItems(callback)

    }).catch(function (err) {
        console.log(err);
        if(err.name=='conflict'){

        }
    });
}

PouchDBService.updatedTags = (tags, callback) =>{

    console.log('updatedTags ', tags);
    DB.bulkDocs([
       tags
    ]).then( () => {
        return DB.allDocs({ include_docs: true });
    }).then( (result)=> {
        callback(result)
    }).catch( (err)=> {
        console.log(err);
    });
}

PouchDBService.fetchTags = (callback) => {

    DB.find({
        selector: { doctype: 'tag' }
    }).then(function (result) {
        callback(result);
        // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.fetchSettings = (callback) => {

    return DB.find({
        selector: { doctype: 'settings' }
    }).then(function (result) {
        callback(result);
        // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });
};


PouchDBService.fetchItemsByIDS = (ids, callback) => {

    DB.find({
        selector: { doctype: 'item', _id: {$in: ids}, }
    }).then(function (result) {
        callback(result.docs);
        // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.fetchItem = (id, callback) => {
    DB.get(id).then(function (doc) {
      callback(doc);
    }).catch(function (err) {
      console.log(err);
    });
};

PouchDBService.itemUpdate = (id, newItem, callback) => {

   /** DB.find({
        selector: { _id: id }
    }).then(function (result) {
        console.log('dbfind', result);
        callback(result);
        // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });**/

   DB.bulkDocs(newItem).then(function () {
       return DB.allDocs({include_docs: true});
   }).then(function (result) {
       //console.log('resulllltt :;: '+JSON.stringify(result));
       //PouchDBService.fetchItems(callback)
       callback(result)


   }).catch(function (err) {
       console.log(err);
       if(err.name=='conflict'){

       }
   });

};


PouchDBService.fetchVarTags = (vid, callback) => {

    DB.find({
      selector: { vid: vid }
    }).then(function (result) {
        console.log('dbfind', result);
        callback(result);
      // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });

};

PouchDBService.fetcTags = (vid, callback) => {
    DB.find({
      selector: {
        $and: [
          { doctype: 'tag' },
          { vid: vid }
        ]
      }
    }).then(function (result) {
        console.log('dbfind tags', result);
        callback(result);
      // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.fetchTasks = (callback) => {
    DB.find({
      selector: { doctype: 'tasklist' }
    }).then(function (result) {
        console.log('dbfind', result);
        callback(result);
      // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.fetchTask = (id, callback) => {
    DB.get(id).then(function (doc) {
      callback(doc);
    }).catch(function (err) {
      console.log(err);
    });
};

PouchDBService.loadFoundTags = (tags) => {
    return DB.find({
      selector: {
          tagid: {
              "$in": tags
          }
      }
    }).then(function (result) {
        // get the associated document id's
        const ItemsArray = [];
        for (let i = 0; i < result.docs.length; i++) {
            ItemsArray.push(result.docs[i].itemid);
        }
        const CleanItemsArray = _.sortedUniq(ItemsArray);

        return { ItemIds: CleanItemsArray, tags: result.docs };
        // get documents

      // yo, a result
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.loadFoundItems = (itemids) => {
    return DB.find({
      selector: {
          _id: {
              "$in": itemids
          }
      }
    }).then(function (result) {
        return result.docs;
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.updateBulk = (docs) => {
    console.log('docs', docs);
    return DB.bulkDocs(docs).then(function (result) {
      return result
    }).catch(function (err) {
      console.log(err);
    });
};

PouchDBService.loadTagsByVarID = (vidarray) => {
    return DB.find({
      selector: {
          vid: {
              "$in": vidarray
          }
      }
    }).then(function (result) {
        return result.docs;
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.loadItemsByPO = (po) => {
    return DB.find({
      selector: {
          "references.purchaseorder": {
              "$in": po
          }
      }
    }).then(function (result) {
        return result.docs;
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.loadTagsByItemID = (itemarray) => {
    return DB.find({
      selector: {
          itemid: {
              "$in": itemarray
          }
      }
    }).then(function (result) {
        console.log('result.docs', result);
        return result.docs;
    }).catch(function (err) {
        console.log('dberr', err);
    });
};
PouchDBService.loadTagsByLocationID = (locArray) => {
    console.log('locArray', locArray);
    return DB.find({
      selector: {
          $and: [
              { doctype: 'tag' },
              { currentlocationid: {
                  "$in": locArray
              } }
            ]
      },
      fields: ['_id', 'currentlocationid', 'currentareaid', 'currentaction'],
    }).then(function (result) {
        return result.docs;
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.loadTagsByAreaID = (area) => {
    const inarea = area;
    console.log('inarea', inarea);
    // return DB.query('tags_by_area_no_action/tags-area-na', {
    //   key: this.inarea
    // }).then(function (res) {
    //     console.log('res.rows', res.rows);
    //   return res.rows;
    // }).catch(function (err) {
    //   // some error
    // });
    return DB.find({
      selector: {
        $and: [
          { doctype: 'tag' },
          { currentareaid: area }
        ]
      }
    }).then(function (result) {
        return result.docs;
    }).catch(function (err) {
        console.log('dberr', err);
    });
};

PouchDBService.updateItemCounts = (items, callback) => {
    console.log('items', items);

    callback()

    // for (let i = 0; i < items.length; i++) {
    //     const varArray = items
    // }
    // "qtyordered": "20",
    // "qtytotal": "30",
    // "qtydelivered": "0",
    // "qtyused": "0",
    // "qtyremain": "0",
    // "qtytransit": "0",
    // "qtydamaged": "0"
};

PouchDBService.fetchUsers = (callback) => {
	console.log('fetchUsers');
  DB.find({
      selector: { doctype: 'user' }
  }).then(function (result) {
      callback(result);
  }).catch(function (err) {
      console.log('dberr', err);
  });
};

export default PouchDBService;
