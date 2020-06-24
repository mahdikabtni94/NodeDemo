const BaseApiController = require('./BaseApiController');
const db = require('../models');

class SequenceController extends BaseApiController {

    constructor() {
        super('sequence');
        this.baseModel = 'sequence';
    }

    addSequence(req, res, next) {

        const url = req.protocol + "://" + req.get("host");
      const imageUrl = JSON.parse(JSON.stringify({url: url + "/seq-images/" + req.file.filename}));
        console.log("sequence**************", req.body);
       // console.log("photo**************", imageUrl.url);
        const sequence = db.sequence.build();
        sequence.stitchcount = req.body.stitchcount;
        sequence.sequence_order = req.body.sequence_order;
        sequence.picture = imageUrl.url;
       // sequence.picture = 'aa-1592389935248.png'
        sequence.coupe_fil = req.body.coupe_fil;
        sequence.back_stitch = req.body.back_stitch;
        sequence.operation_template_id = req.body.operation_template_id;
        sequence.parent_sequence = req.body.parent_sequence;
        sequence.back_stitch_positive_tolerence = req.body.back_stitch_positive_tolerence;
        sequence.back_stitch_negative_tolerence = req.body.back_stitch_negative_tolerence;
        sequence.stitch_count_positive_tolerence = req.body.stitch_count_positive_tolerence;
        sequence.stitch_count_negative_tolerence = req.body.stitch_count_negative_tolerence;
        sequence.with_subsequence = req.body.with_subsequence;
        sequence.description = req.body.description;
        sequence.second_back_stitch = req.body.second_back_stitch;

        sequence.save().then(CreatedModel => {
            console.log("sequenceSaved**************", CreatedModel);
            let _this = this;
            let whereQuery = {};
            whereQuery[_this.getModelPrimaryKey()] = CreatedModel[_this.getModelPrimaryKey()];
            let includesQuery = [];
            if (CreatedModel.getModelIncludes && CreatedModel.getModelIncludes()) {
                CreatedModel.getModelIncludes().forEach(icludeItem => {
                    if (db[icludeItem]) {
                        includesQuery.push({
                            model: db[icludeItem],
                            required: false,
                        });
                    }
                })
            }
            db.sequence.findOne({
                where: whereQuery,
                include: includesQuery
            }).then(resFind => {
                res.status(201).json({
                    message: 'sequence Added Successfully',
                    sequence:
                        {
                            resFind,

                        }
                });

            })


        }).catch(err =>
            res.status(500).json(err)
        )
    }

    UpdateSequence(req, res, next) {
        const where = {};
        let imagePath = req.body.picture;
        where[this.getModelPrimaryKey()] = req.params.id;
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = JSON.parse(JSON.stringify({url: url + "/seq-images/" + req.file.filename}));
        }
        db.sequence.update(
            {
                stitchcount: req.body.stitchcount,
                sequence_order: req.body.sequence_order,
                picture: imagePath.url,
                coupe_fil: req.body.coupe_fil,
                back_stitch: req.body.back_stitch,
                operation_template_id: req.body.operation_template_id,
                parent_sequence: req.body.parent_sequence,
                back_stitch_positive_tolerence: req.body.back_stitch_positive_tolerence,
                back_stitch_negative_tolerence: req.body.back_stitch_negative_tolerence,
                stitch_count_positive_tolerence: req.body.stitch_count_positive_tolerence,
                stitch_count_negative_tolerence: req.body.stitch_count_negative_tolerence,
                description: req.body.description,
                second_back_stitch: req.body.second_back_stitch,
            },
            {where: where})
            .then(result => {
                console.log(result);
                res.status(200).json({message: 'Update Successful!', customer: result});
            })

    }

    FindByOperation(req, res, next) {
        if (!this.db[this.baseModel]) {
            return res.status(500).send({
                status: false,
                message: 'System.Error.ModelNotDefined'
            })
        }

        this.db[this.baseModel].findAll({
            where: {
                operation_template_id: req.params.id
            }
        }).then(
            result => {
                let includesQuery = [];
                if (result[0].getModelIncludes && result[0].getModelIncludes()) {
                    result[0].getModelIncludes().forEach(includeItem => {
                        if (this.db[includeItem]) {
                            includesQuery.push({
                                model: this.db[includeItem],
                                required: false,
                            });
                        }
                    })

                }

                this.db[this.baseModel].findAll({
                    include: includesQuery,
                    where: {
                        operation_template_id: req.params.id
                    }
                }).then(resFind => {
                    res.json({
                        message: 'success',
                        data: resFind,
                        status: 1,
                    })
                })
            }).catch(err =>
            res.status(500).json(err)
        )

    }

}

module.exports = SequenceController;
