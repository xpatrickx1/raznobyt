import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from '../i18n/router';
import withRouter from '../lib/withRouter';
import { getProductBySlugSync, getProducts } from '../lib/products';
import staticProducts from '../data/products.js';
import { getSimilarProducts } from '../../scripts/getSimilarProducts.js';
import ProductView from '../components/Product/ProductView';

function ProductPage({ slug: externalSlug = null, initialProduct = null }) {
  const { slug: paramSlug } = useParams();
  const slug = externalSlug ?? paramSlug;

  const [product, setProduct] = useState(() => {
    return initialProduct || (slug ? getProductBySlugSync(slug) : null);
  });

  const [related, setRelated] = useState(() => {
    const current = initialProduct || (slug ? getProductBySlugSync(slug) : null);
    return current ? getSimilarProducts(current, staticProducts, 4) : [];
  });

  useEffect(() => {
    const current = initialProduct || (slug ? getProductBySlugSync(slug) : null);
    setProduct(current);
    if (current) {
      setRelated(getSimilarProducts(current, staticProducts, 4));
    }
  }, [slug, initialProduct]);

  if (!product) return <Navigate to="/catalog" replace />;

  return <ProductView product={product} related={related} />;
}

export default withRouter(ProductPage);
