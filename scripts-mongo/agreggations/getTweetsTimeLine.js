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
            $unwind: {
                path: "$tweets",
            }
        },

        // Stage 4
        {
            $sort: {
               "tweets.createdAt": -1 
            }
        },

        // Stage 5
        {
            $skip: 0
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
                        "$user",
                        0
                    ]
                }
            }
        },

        // Stage 9
        {
            $project: {
                _id: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                user: {
                    _id: "$user._id",
                    name: "$user.name",
                    username:"$user.username",
                    country:"$user.country",
                    typeUser:"$user.typeUser",
                    email:"$user.email",
                    createdAt:"$user.createdAt"
                }
            }
        }
    ],

    // Options
    {

    }

);