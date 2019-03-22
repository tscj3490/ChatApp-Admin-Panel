import Config from "../../config"

var ServiceApi = {

    uploadFile(file, callback, ext, progressCallback) {
        console.log('uploading data is ', file);
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null 
        var obj = {
            _filename: file.name,
            size: file.size,
            mimeType: file.type
        };

        if (ext) {
            _.extend(obj, ext);
        }

        var formData = new FormData(); 
        formData.append('file', file)
        formData.append('filename', file.name)
        formData.append('size', file.size)
        formData.append('mimeType', file.type)

        //console.log('uploading data is ', formData);
        $.ajax({
            url: Config.BACKEND_API_URL + "/api/v1/uploads/image",
            data: formData,
            method: 'post',            
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function (e) {
                        console.log('here', e)
                        if (e.lengthComputable) {
                            var max = e.total;
                            var current = e.loaded;

                            if (progressCallback) {
                                progressCallback(max, current)
                            }
                        }
                    }, false);
                }
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false,
            // headers: {
            //     Authorization: 'Basic ' + localStorage.token
            // },
            headers: {
                'Authorization': user?'Bearer ' + user['token']:null,
            },
            success: function (data) {
                if (data) {
                    callback(data);
                    console.log('data ', data);
                } else {
                    callback('empty data')
                }
            },
            error: function (data) {
                callback(data)
            }
        });
    },



    getList(sub_url, cb) {
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null 
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'GET',
            dataType: "json"
        }).then((res) => {
            if (cb) cb(null, res)
        }, (error) => {
            if (cb) cb(error.responseText, null)
        })
    },
    postItem(sub_url, data, cb) {
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null 
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },
    putItem(sub_url, data, cb) {
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null 
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'PUT',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },
    deleteItem(sub_url, cb){
        let user = sessionStorage.getItem('currentUser')?JSON.parse(sessionStorage.getItem('currentUser')):null 
        $.ajax({
            url: Config.BACKEND_API_URL + sub_url,
            method: 'DELETE',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (cb) cb(null, data)
            },
            failure: function (errMsg) {
                if (cb) cb(errMsg, null)
            }
        })
    },

    // Device
    getDeviceList(cb) {
        this.getList("/devices", cb)
    },
    getDevice(id, cb) {
        this.getList("/devices/" + id, cb)
    },
    insertDevice(data, cb) {
        this.postItem("/devices", data, cb)
    },
    updateDevice(data, cb) {
        this.putItem("/devices/" + data.ID, data, cb)
    },
    deleteDevice(id, cb){
        this.deleteItem("/devices/"+id, cb)
    },

    // Make
    getMakeList(cb) {
        this.getList("/makes", cb)
    },
    getMakeListWithParentID(parentId, cb) {
        this.getList('/makes/field?field=parent_device&query=' + parentId, cb);
    },
    getMake(id, cb) {
        this.getList("/makes/" + id, cb)
    },
    insertMake(data, cb) {
        this.postItem("/makes", data, cb)
    },
    updateMake(data, cb) {
        this.putItem("/makes/" + data.ID, data, cb)
    },
    deleteMake(id, cb){
        this.deleteItem("/makes/"+id, cb)
    },

    // Model
    getModelList(cb) {
        this.getList("/models", cb)
    },
    getModelListWithParentID(parentId, cb) {
        this.getList('/models/field?field=parent_make&query=' + parentId, cb);
    },
    getModel(id, cb) {
        this.getList("/models/" + id, cb)
    },
    insertModel(data, cb) {
        this.postItem("/models", data, cb)
    },
    updateModel(data, cb) {
        
        this.putItem("/models/" + data.ID, data, cb)
    },
    deleteModel(id, cb){
        this.deleteItem("/models/"+id, cb)
    },

    // Service
    getServiceList(cb) {
        this.getList("/services", cb)
    },
    getService(id, cb) {
        this.getList("/services/" + id, cb)
    },
    insertService(data, cb) {
        this.postItem("/services", data, cb)
    },
    updateService(data, cb) {
        console.log(data)
        this.putItem("/services/" + data.ID, data, cb)
    },
    deleteService(id, cb){
        this.deleteItem("/services/"+id, cb)
    },
}

module.exports = ServiceApi;