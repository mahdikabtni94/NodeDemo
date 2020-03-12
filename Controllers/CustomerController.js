const BaseApiController = require('./BaseApiController');
const db = require('../models');


class CustomerController extends BaseApiController {

    constructor() {
        super('customer');
        this.baseModel = 'customer';
    }

    addCustomer(req, res, next) {

        const url = req.protocol + "://" + req.get("host");
        const imageURL = JSON.parse(JSON.stringify({url: url + "/images/" + req.file.filename}));
        const customer = db.customer.build();
        customer.client_name = req.body.client_name;
        customer.address = req.body.address;
        customer.phoneNumber = req.body.phoneNumber;
        customer.email = req.body.email;
        customer.technical_contact = req.body.technical_contact;
        customer.sales_contact = req.body.sales_contact;
        customer.fax = req.body.fax;
        customer.picpath = imageURL.url;
        //  customer.picpath = "adadada-1583762672075.jpg"
        customer.CountryId = req.body.CountryId;
        customer.StateId = req.body.StateId;
        customer.CityId = req.body.CityId;

        customer.save().then(CreatedModel => {
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
            db.customer.findOne({
                where: whereQuery,
                include: includesQuery
            }).then(resFind => {
                res.status(201).json({
                    message: 'Customer Added Successfully',
                    customer:
                        {
                             resFind,

                        }
                });

            })


        }).catch(err =>
                res.status(500).json(err)
            )
    }

    UpdateCustomer(req, res, next) {
        const where = {};
        let imagePath = req.body.picpath;
        where[this.getModelPrimaryKey()] = req.params.id;
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = JSON.parse(url + "/images/" + req.file.filename);
        }
        db.customer.update(
            {
                client_name: req.body.client_name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                technical_contact: req.body.technical_contact,
                sales_contact: req.body.sales_contact,
                fax: req.body.fax,
                picpath: imagePath,
                CountryId: req.body.CountryId,
                StateId: req.body.StateId,
                CityId: req.body.CityId
            },
            {where: where})
            .then(result => {
                console.log(result);
                res.status(200).json({message: 'Update Successful!', customer: result});
            })

    }

}

module.exports = CustomerController;
