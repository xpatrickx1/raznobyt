import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import withRouter from '../lib/withRouter';
import { getProductBySlug, getProductsByCategory } from '../lib/products';
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
    getProductsByCategory(product.category)
      .then(all => setRelated(all.filter(p => p.id !== product.id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [product?.category, product?.id]);

  if (product === undefined) return null;
  if (!product) return <Navigate to="/catalog" replace />;

  return <ProductView product={product} related={related} />;
}

export default withRouter(ProductPage);