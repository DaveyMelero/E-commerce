const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

  // find all products
  // be sure to include its associated Category and Tag data
  router.get('/', async (req, res) => {
    try{
      const productData = await Product.findAll({
        include: [{ model: Category, Tag}],
      });
      res.status(200).json(productData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// get one product

router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category, Tag}],
    });

    if(!productData){
      res.status(404).json({message: 'No Product Found With That ID'});
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new products


// router.post('/', (req, res) => {
 
//   Product.create(req.body)
//     .then((product) => {
//       // if there's product tags, we need to create pairings to bulk create in the ProductTag model
//       if (req.body.tagIds.length) {
//         const productTagIdArr = req.body.tagIds.map((tag_id) => {
//           return {
//             product_id: product.id,
//             tag_id,
//           };
//         });
//         return ProductTag.bulkCreate(productTagIdArr);
//       }
//       // if no product tags, just respond
//       res.status(200).json(product);
//     })
//     .then((productTagIds) => res.status(200).json(productTagIds))
//     .catch((err) => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

router.post('/', (req, res) => {
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tag_id
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});




// update product

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value

  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }

});




router.delete('/:id', async (req, res) => {
  try {
    const trashProduct = await Product.destroy({
      where: {
        product_id: req.params.id
      }
    });
    if (trashProduct === 0) {
      return res.status(404).json({ message: 'Unknown Product' });
    }
    res.status(200).json({ message: 'Product deleted!' });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;