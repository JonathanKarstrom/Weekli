var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getAll = getAll;
service.setWeek = setWeek;
service.setTags = setTags;
service.addRecipe = addRecipe;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray(function (err,users){
        if(err) deferred.reject(err.name + ': '+err.message);
        deferred.resolve(users);
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
        
        user.recipes=[
    {
        name: "Korv stroganoff",
        tags: [
            "vardagsmat",
            "kött",
            "billigt"
        ],
        time: 30,
        ingredients: [
            {
                name: 'falukorv',
                amount: 400,
                unit: 'gram'
            },
            {
                name: 'ris',
                amount: 400,
                unit: 'gram'
            },
            {
                name: 'grädde',
                amount: 2,
                unit: 'dl'
            },
            {
                name: 'senap',
                amount: 3,
                unit: 'tsk'
            },
            {
                name: 'tomatpuré',
                amount: 3,
                unit: 'msk'
            },
            {
                name: 'gul lök',
                amount: 2,
                unit: 'st'
            }
        ]
    }];
        user.week=[
    {
        day: 'måndag',
        tags: ['vegetariskt'],
        course: {
            name: "Korv stroganoff",
            tags: [
                "vardagsmat",
                "kött",
                "billigt"
            ],
            time: 30,
            ingredients: [
                {
                    name: 'falukorv',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'ris',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'grädde',
                    amount: 2,
                    unit: 'dl'
                },
                {
                    name: 'senap',
                    amount: 3,
                    unit: 'tsk'
                },
                {
                    name: 'tomatpuré',
                    amount: 3,
                    unit: 'msk'
                },
                {
                    name: 'gul lök',
                    amount: 2,
                    unit: 'st'
                }
            ]
        }
    },
    {
        day: 'tisdag',
        tags: [],
        course: {
            name: "Korv stroganoff",
            tags: [
                "vardagsmat",
                "kött",
                "billigt"
            ],
            time: 30,
            ingredients: [
                {
                    name: 'falukorv',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'ris',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'grädde',
                    amount: 2,
                    unit: 'dl'
                },
                {
                    name: 'senap',
                    amount: 3,
                    unit: 'tsk'
                },
                {
                    name: 'tomatpuré',
                    amount: 3,
                    unit: 'msk'
                },
                {
                    name: 'gul lök',
                    amount: 2,
                    unit: 'st'
                }
            ]
        }
    },
    {
        day: 'onsdag',
        tags: ['vardagsmat'],
        course: {
            name: "Korv stroganoff",
            tags: [
                "vardagsmat",
                "kött",
                "billigt"
            ],
            time: 30,
            ingredients: [
                {
                    name: 'falukorv',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'ris',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'grädde',
                    amount: 2,
                    unit: 'dl'
                },
                {
                    name: 'senap',
                    amount: 3,
                    unit: 'tsk'
                },
                {
                    name: 'tomatpuré',
                    amount: 3,
                    unit: 'msk'
                },
                {
                    name: 'gul lök',
                    amount: 2,
                    unit: 'st'
                }
            ]
        }
    },
    {
        day: 'torsdag',
        tags: ['vardagsmat'],
        course: {
            name: "Korv stroganoff",
            tags: [
                "vardagsmat",
                "kött",
                "billigt"
            ],
            time: 30,
            ingredients: [
                {
                    name: 'falukorv',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'ris',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'grädde',
                    amount: 2,
                    unit: 'dl'
                },
                {
                    name: 'senap',
                    amount: 3,
                    unit: 'tsk'
                },
                {
                    name: 'tomatpuré',
                    amount: 3,
                    unit: 'msk'
                },
                {
                    name: 'gul lök',
                    amount: 2,
                    unit: 'st'
                }
            ]
        }
    },
    {
        day: 'fredag',
        tags: ['helgmat'],
        course: {
            name: "Korv stroganoff",
            tags: [
                "vardagsmat",
                "kött",
                "billigt"
            ],
            time: 30,
            ingredients: [
                {
                    name: 'falukorv',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'ris',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'grädde',
                    amount: 2,
                    unit: 'dl'
                },
                {
                    name: 'senap',
                    amount: 3,
                    unit: 'tsk'
                },
                {
                    name: 'tomatpuré',
                    amount: 3,
                    unit: 'msk'
                },
                {
                    name: 'gul lök',
                    amount: 2,
                    unit: 'st'
                }
            ]
        }
    },
    {
        day: 'lördag',
        tags: ['helgmat'],
        course: {
            name: "Korv stroganoff",
            tags: [
                "vardagsmat",
                "kött",
                "billigt"
            ],
            time: 30,
            ingredients: [
                {
                    name: 'falukorv',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'ris',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'grädde',
                    amount: 2,
                    unit: 'dl'
                },
                {
                    name: 'senap',
                    amount: 3,
                    unit: 'tsk'
                },
                {
                    name: 'tomatpuré',
                    amount: 3,
                    unit: 'msk'
                },
                {
                    name: 'gul lök',
                    amount: 2,
                    unit: 'st'
                }
            ]
        }
    },
    {
        day: 'söndag',
        tags: ['helgmat'],
        course: {
            name: "Korv stroganoff",
            tags: [
                "vardagsmat",
                "kött",
                "billigt"
            ],
            time: 30,
            ingredients: [
                {
                    name: 'falukorv',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'ris',
                    amount: 400,
                    unit: 'gram'
                },
                {
                    name: 'grädde',
                    amount: 2,
                    unit: 'dl'
                },
                {
                    name: 'senap',
                    amount: 3,
                    unit: 'tsk'
                },
                {
                    name: 'tomatpuré',
                    amount: 3,
                    unit: 'msk'
                },
                {
                    name: 'gul lök',
                    amount: 2,
                    unit: 'st'
                }
            ]
        }
    }
];

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function setWeek(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function setTags(_id) {
    return null;
}

function addRecipe(_id) {
    return null;
}