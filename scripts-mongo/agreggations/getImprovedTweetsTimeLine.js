db.getCollection("followings").aggregate(

    // Pipeline
    [
        // Stage 1
        {
            $match: {
                 followerUser: ObjectId("6171dbb4e3a58c543f47af5f")
            }
        },

        // Stage 2
        {
            $lookup: {
                from: "tweets",
                localField: "followedUser",
                foreignField: "user",
                as: "tweets",
            }
        },

        // Stage 3
        {
            $match: {
                "tweets.createdAt": {
                    $lt: ISODate("2022-07-11T18:42:10.173Z")
                } 
            }
        },

        // Stage 4
        {
            $unwind: {
                path: "$tweets",
            }
        },

        // Stage 5
        {
            $sort: {
               "tweets.createdAt": -1
            }
        },

        // Stage 6
        {
            $limit: 20
        },

        // Stage 7
        {
            $lookup: // Equality Match
            {
                from: "users",
                localField: "tweets.user",
                foreignField: "_id",
                as: "user"
            }
        },

        // Stage 8
        {
            $project: {
                _id: "$tweets._id",
                description: "$tweets.description",
                createdAt: "$tweets.createdAt",
                updatedAt: "$tweets.updatedAt",
                user: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: "$user",
                                as: "i",
                                in: {
                                    _id: "$$i._id",
                                    name: "$$i.name",
                                    username: "$$i.username",
                                    country: "$$i.country",
                                    typeUser: "$$i.typeUser",
                                    email: "$$i.email",
                                    createdAt: "$$i.createdAt"
                                }
                            }
                        },
                        0
                    ]
                }
            }
        }
    ],

    // Options
    {

    }

);