var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

const Distributors = require('../models/distributors');
const Categorys = require('../models/categorys');
const Products = require('../models/products');
const Users = require('../models/users');
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
router.post('/add-distributor', async (req, res) => {
    const data = req.body;
    const newDistributors = new Distributors({
        name: data.name,
    });
    const result = await newDistributors.save();
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
            "data": {},
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
router.put('/update-category/:id_category', async (req, res) => {
    const id_category = req.params.id_category;
    const newData = req.body;

    const result = await Categorys.findByIdAndUpdate(id_category, newData, { new: true });
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
router.delete('/delete-category/:id_category', async (req, res) => {
    const { id_category } = req.params;
    const result = await Categorys.findByIdAndDelete(id_category);
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
router.get('/get-user-by-email', async (req, res) => {
    const email = req.query.email;
    const user = await Users.findOne({ email: email });
    res.json({ 
        status: 200,
        messenger: "User!",
        data: user 
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