const joi=require("joi");
module.exports.listingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.string(),
    }).required()
});
// module.exports.reviewSchema=joi.object({
//     review:joi.object({
//         rating:joi.number().required().min(1).max(5),
//         comment:joi.string().required(),
//     }).required
// })
module.exports.reviewSchema=joi.object({
    review: joi.object({
        comment:joi.string().required(),
        rating: joi.number().required().min(1).max(5),
    }),
});
// module.exports.reviewSchema=joi.object({
//     review: joi.object({
//         rating: "value_from_value",
//         comment:"value_from_value",
//     }),
// });