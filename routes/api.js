var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const JWT = require('jsonwebtoken');
const SECRETKEY = 'PH41626';

const Distributors = require('../models/distributors');
const Categorys = require('../models/categorys');
const Products = require('../models/products');
const Users = require('../models/users');
const Bills = require('../models/bills');
const OrderDetails = require('../models/orderDetails');
const Orders = require('../models/orders');
const Carts = require('../models/cart');
const Uploads = require('../config/common/upload');

module.exports = router;

router.post('/add-category', async (req, res) => {
    const data = req.body;
    const newCategory = new Categorys({
        name: data.name,
    })
    const result = await newCategory.save();
    if (result) {
        res.json({
            status: 200,
            messenger: 'Successfully!',
            data: result,
        });
    } else {
        res.json({
            status: 400,
            messenger: 'Failed!',
            data: [],
        });
    }
})
router.post('/add-distributor', async (req, res) => {
    const data = req.body;
    const newDistributors = new Distributors({
        name: data.name,
    });
    const result = await newDistributors.save();
    if (result) {
        res.json({
            status: 200,
            messenger: 'Successfully!',
            data: result,
        });
    } else {
        res.json({
            status: 400,
            messenger: 'Failed!',
            data: {},
        });
    }
})
router.post('/add-product', Uploads.single('thumbnail'), async (req, res) => {
    const data = req.body;
    const { file } = req;
    const urlImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
    const newProduct = new Products({
        name: data.name,
        quantity: data.quantity,
        price: data.price,
        status: data.status,
        thumbnail: urlImage,
        description: data.description,
        id_category: data.id_category,
        id_distributor: data.id_distributor
    });
    const result = (await (await newProduct.save()).populate('id_category')).populate('id_distributor');
    if (result) {
        res.json({
            "status": 200,
            "messenger": "Thêm thành công!",
            "data": result,
        });
    } else {
        res.json({
            "status": 400,
            "messenger": "Lỗi, Thêm thất bại!",
            "data": [],
        });
    }
})
router.post('/add-bill',async(req,res) => {
    const data = req.body;
    const newBill = new Bills({
        id_user: data.id_user,
    })
    const result = await newBill.save();
    if (result) {
        res.json({
            status: 200,
            messenger: 'Successfully!',
            data: result,
        })
    } else {
        res.json({
            status: 400,
            messenger: 'Failed!',
            data: [],
        })
    }
})
router.post('/add-orderDetail',async(req,res) => {
    const data = req.body;
    const newBillDetail = new BillDetails({
        id_bill: data.id_bill,
        id_product: data.id_product,
        quantity: data.quantity,
    })
    const result = await newBillDetail.save();
    if (result) {
        res.json({
            status: 200,
            messenger: 'Successfully!',
            data: result,
        })
    } else {
        res.json({
            status: 400,
            messenger: 'Failed!',
            data: [],
        })
    }
})
router.post('/add-cart',async(req,res) => {
    const data = req.body;
    const newCartItem = new Carts({
        id_user: data.id_user,
        id_product: data.id_product,
        quantity: data.quantity,
        isSelected: data.isSelected,
    })
    const result = await newCartItem.save();
    if (result) {
        res.json({
            status: 200,
            messenger: 'Successfully!',
            data: result,
        })
    } else {
        res.json({
            status: 400,
            messenger: 'Failed!',
            data: [],
        })
    }
})

router.put('/update-category/:id_category', async (req, res) => {
    const id_category = req.params.id_category;
    const newData = req.body;

    const result = await Categorys.findByIdAndUpdate(id_category, newData, { new: true });
    if (result) {
        res.json({
            status: 200,
            messenger: 'Successfully',
            data: result,
        });
    } else {
        res.json({
            status: 400,
            messenger: 'Failed',
            data: [],
        });
    }
})
router.put('/update-distributor/:id_distributor', async (req, res) => {
    const id_distributor = req.params.id_distributor;
    const newData = req.body;

    const result = await Distributors.findByIdAndUpdate(id_distributor, newData, { new: true });
    if (result) {
        res.json({
            "status": 200,
            "messenger": "Sửa thành công!",
            "data": result,
        });
    } else {
        res.json({
            "status": 400,
            "messenger": "Lỗi, Thêm thất bại!",
            "data": [],
        });
    }
})
router.put('/update-product/:id_product', Uploads.single('thumbnail'), async (req, res) => {
    const id_product = req.params.id_product;
    const newData = req.body;
    const { file } = req;

    const oldProduct = await Products.findById(id_product);

    let updateFields = {
        name: newData.name,
        quantity: newData.quantity,
        price: newData.price,
        status: newData.status,
        description: newData.description,
        id_category: newData.id_category,
        id_distributor: newData.id_distributor,
    };
    if (file) {
        if (oldProduct && oldProduct.thumbnail) {
            const oldThumbnailPath = path.join(__dirname, '../public/uploads/', path.basename(oldProduct.thumbnail));
            fs.unlinkSync(oldThumbnailPath);
        }

        const urlImage = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
        updateFields.thumbnail = urlImage;
    }
    const updatedProduct = await Products.findByIdAndUpdate(id_product, updateFields, { new: true });

    if (updatedProduct) {
        res.json({
            "status": 200,
            "messenger": "Sửa thành công!",
            "data": updatedProduct,
        });
    } else {
        res.json({
            "status": 400,
            "messenger": "Lỗi, Thêm thất bại!",
            "data": [],
        });
    }
});
router.post('/update-product-without-thumbnail/:id_product', async (req, res) => {
    const id_product = req.params.id_product;
    const newData = req.body;

    const updatedFields = {
        name: newData.name,
        quantity: newData.quantity,
        price: newData.price,
        status: newData.status,
        description: newData.description,
        id_category: newData.id_category,
        id_distributor: newData.id_distributor,
    };

    try {
        const updatedProduct = await Products.findByIdAndUpdate(id_product, updatedFields, { new: true });

        if (updatedProduct) {
            res.json({
                status: 200,
                message: "Cập nhật sản phẩm thành công!",
                data: updatedProduct,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Không tìm thấy sản phẩm để cập nhật!",
                data: null,
            });
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
});
router.put('/update-billDetail/:id_billDetail',async(req,res) => {
    const id_billDetail = req.params.id_billDetail;
    const newData = req.body;

    const result = await BillDetails.findByIdAndUpdate(id_billDetail,newData,{new: true}); 
    if (result) {
        res.json({
            status: 200,
            messenger: 'Successfully',
            data: result,
        })
    } else {
        res.json({
            status: 400,
            messenger: 'Failed',
            data: [],
        })
    }

});
router.put('/update-cart/:id_cart',async(req,res) => {
    const id_cart = req.params.id_cart;
    const newData = req.body;
    const result = await Carts.findByIdAndUpdate(id_cart,newData, { new: true});

    if (result) {
        res.json({
            "status": 200,
            "messenger": "Successfully!",
            "data": result,
        });
    } else {
        res.json({
            "status": 400,
            "messenger": "Failed!",
            "data": [],
        });
    }
})
router.put('/update-cart',async(req,res) => {
    const newData = req.body;
    const updatedItems = [];
    for (const item of newData) {
        const updatedItem = await Carts.findByIdAndUpdate(item._id, item, { new: true });
        updatedItems.push(updatedItem);
    }
    res.json({
        "status": 200,
        "messenger": "Successfully!",
        "data": updatedItems,
    });
})

router.delete('/delete-category/:id_category', async (req, res) => {
    const { id_category } = req.params;
    const result = await Categorys.findByIdAndDelete(id_category);
    if (result) {
        res.json({
            "status": 200,
            "messenger": "Successfully!",
            "data": result,
        });
    } else {
        res.json({
            "status": 400,
            "messenger": "Failed!",
            "data": [],
        });
    }
});
router.delete('/delete-distributor/:id_distributor', async (req, res) => {
    const { id_distributor } = req.params;
    const result = await Distributors.findByIdAndDelete(id_distributor);
    if (result) {
        res.json({
            "status": 200,
            "messenger": "Xóa thành công!",
            "data": result,
        });
    } else {
        res.json({
            "status": 400,
            "messenger": "Lỗi, Xóa thất bại!",
            "data": [],
        });
    }
})
router.delete('/delete-product/:id_product', async (req, res) => {
    const { id_product } = req.params;
    const result = await Products.findByIdAndDelete(id_product);
    if (result && result.thumbnail) {
        const oldThumbnailPath = path.join(__dirname, '../public/uploads/', path.basename(result.thumbnail));
        fs.unlinkSync(oldThumbnailPath);
    }
    if (result) {
        res.json({
            "status": 200,
            "messenger": "Xóa thành công!",
            "data": result,
        });
    } else {
        res.json({
            "status": 400,
            "messenger": "Lỗi, Xóa thất bại!",
            "data": [],
        });
    }
})
// router.delete('/delete-bill/:id_bill',async(req,res) => {
//     const { id_bill } = req.params;
//     const result = await Bills.findByIdAndDelete(id_bill);
//     const resultDetail = await BillDetails.deleteMany({ id_bill: id_bill });
//     if (result) {
//         res.json({
//             status: 200,
//             messenger: 'Successfully',
//             data: result,
//         })
//     } else {
//         res.json({
//             status: 400,
//             messenger: 'Failed',
//             data: [],
//         })
//     }
// })


router.get('/get-user-by-email', async (req, res) => {
    const email = req.query.email;
    const user = await Users.findOne({ email: email });
    // const token = JWT.sign({id: user._id},SECRETKEY,{expiresIn: '1h'});
    // const refreshToken = JWT.sign({id: user._id},SECRETKEY,{expiresIn: '1d'});
    res.json({ 
        status: 200,
        messenger: "User!",
        data: user,
        // token: token,
        // refreshToken: refreshToken,
    });
});
router.get('/get-list-categories',async(req,res) => {
    const data = await Categorys.find();
    res.json({
        "status": 200,
        "messenger": "Danh sách Danh mục sản phẩm!",
        "data": data,
    });
})
router.get('/get-category-by-id/:id_category',async(req,res) => {
    const id_category = req.params.id_category;
    const data = await Categorys.findById(id_category);
    res.json({
        "status": 200,
        "messenger": "Danh mục mục sản phẩm theo ID!",
        "data": data,
    });
})
router.get('/get-list-distributors',async(req,res) => {
    const data = await Distributors.find();
    res.json({
        "status": 200,
        "messenger": "Danh sách Nhà phân phối!",
        "data": data,
    });
})
router.get('/get-distributor-by-id/:id_distributor',async(req,res) => {
    const id_distributor = req.params.id_distributor;
    const data = await Distributors.findById(id_distributor);
    res.json({
        "status": 200,
        "messenger": "Nhà phân phối theo ID!",
        "data": data,
    });
})
router.get('/get-list-products',async(req,res) => {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1];
    // if (token == null) return res.sendStatus(401);
    // let payload;
    // JWT.verify(token, SECRETKEY, (err,_payload) => {
    //     if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
    //     if (err) return res.sendStatus(403);
    //     payload = _payload;
    // })
    const data = await Products.find();
    res.json({
        "status": 200,
        "messenger": "Danh sách Sản phẩm!",
        "data": data,
    });
})
router.get('/get-product-by-id/:id_product',async(req,res) => {
    const id_product = req.params.id_product;
    const data = await Products.findById(id_product);
    res.json({
        "status": 200,
        "messenger": "Sản phẩm theo ID!",
        "data": data,
    });
})
router.get('/get-list-bill-by-idUser/:id_user',async(req,res) => {
    const id_user = req.params.id_user;
    const data = await Bills.find({ id_user: id_user });
    if (data) {
        res.json({
            status: 200,
            messenger: 'Successfully',
            data: data,
        })
    } else {
        res.json({
            status: 400,
            messenger: 'Failed',
            data: data,
        })
    }
})
router.get('/get-bill-by-id/:id_bill',async(req,res) => {
    const id_bill = req.params.id_bill;
    const data = await Bills.findById(id_bill);
    res.json({
        status: 200,
        messenger: 'Successfully!',
        data: data,
    })
})
router.get('/get-list-cart-by-id/:id_user',async(req,res) => {
    const id_user = req.params.id_user;
    const data = await Carts.find({id_user: id_user});
    if (data) {
        res.json({
            status: 200,
            messenger: 'Successfully',
            data: data,
        })
    } else {
        res.json({
            status: 400,
            messenger: 'Failed',
            data: [],
        })
    }
})

router.post('/register-account',Uploads.single('avatar'),async(req,res) => {
    const data = req.body;
    const {file} = req;
    const newUser = Users({
        email: data.email,
        password: data.password,
        name: data.name,
        avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    });
    const result = await newUser.save();
    if(result) {
        res.json({
            "status": 200,
            "messenger": "Tạo tài khoản thành công!",
            "data": result,
        })
    } else {
        res.json({
            "status": 400,
            "messenger": "Tạo tài khoản thất bại!",
            "data": [],
        })
    }
})
router.get('/check-email', async (req, res) => {
    const email = req.query.email;
    try {
        const user = await Users.findOne({ email: email });
        if (user) {
            res.json({ 
                status: 200,
                messenger: "Email đã được sử dụng!",
                registered: true 
            });
        } else {
            res.json({ 
                status: 400,
                messenger: "Email chưa đã được sử dụng!",
                registered: false 
            });
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra email:", error);
    }
});
router.get('/check-category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const count = await Products.countDocuments({ id_category: categoryId });
        if (count > 0) {
            res.json({ 
                status: 400, 
                message: 'Không thể xóa.',
                data: {count},
            });
        } else {
            res.json({ 
                status: 200, 
                message: 'Có thể xóa.',
                data: {count},
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/check-distributor/:id', async (req, res) => {
    try {
        const distributorId = req.params.id;
        const count = await Products.countDocuments({ id_distributor: distributorId });
        if (count > 0) {
            res.json({ 
                status: 400, 
                message: 'Không thể xóa.',
                data: {count},
            });
        } else {
            res.json({ 
                status: 200, 
                message: 'Có thể xóa.',
                data: {count},
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/search-product',async (req,res) => {
    const key = req.query.key;
    const data = await Products.find({name: {'$regex': key, '$options': 'i'}})
    .sort({creatAt: -1});

    if (data) {
        res.json({
            status: 200,
            messenger: 'Successfully!',
            data: data,
        })
    } else {
        res.json({
            status: 400,
            messenger: 'Failed!',
            data: data,
        })
    }
})

router.post('/add-order',async(req,res) => {
    const data = req.body;
    const newOrder = new Orders({
        order_code: data.order_code,
        id_user: data.id_user,
    })
    const result = await newOrder.save();
    if (result) {
        res.json({
            status: 200,
            messenger: 'Successfully!',
            data: result,
        })
    } else {
        res.json({
            status: 400,
            messenger: 'Failed',
            data: [],
        })
    }
})