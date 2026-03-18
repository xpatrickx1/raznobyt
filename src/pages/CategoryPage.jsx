import { useParams, Navigate } from 'react-router-dom';
import categories from '../data/categories.json';
import Catalog from './Catalog';

export default function CategoryPage() {
  const { slug } = useParams();
  const cat = categories.find(c => c.slug === slug);
  if (!cat) return <Navigate to="/catalog" replace />;
  return <Catalog initialCategory={cat.id} />;
}
