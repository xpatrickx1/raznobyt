import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import withRouter from '../lib/withRouter';
import { getProductBySlug, getProducts } from '../lib/products';
import { getSimilarProducts } from '../../scripts/getSimilarProducts.js';
import ProductView from '../components/Product/ProductView';

function ProductPage({ slug: externalSlug = null }) {
  const { slug: paramSlug } = useParams();
  const slug = externalSlug ?? paramSlug;

  const [product, setProduct] = useState(undefined);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    getProductBySlug(slug)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    getProducts()
      .then(all => {
        const similar = getSimilarProducts(product, all, 4);
        setRelated(similar);
      })
      .catch(() => setRelated([]));
  }, [product]);

  if (product === undefined) return null;
  if (!product) return <Navigate to="/catalog" replace />;

  return <ProductView product={product} related={related} />;
}

export default withRouter(ProductPage);