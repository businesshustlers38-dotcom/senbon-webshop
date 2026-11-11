import { Link } from 'react-router-dom'
import { useCart } from './cartContext'
import { formatPrice } from './format'
import { getRitual } from './data/catalog'
import ProductImage from './ProductImage'

// Ett produktkort som används i butiken, på ritualsidor och under "Complete the ritual"
function ProductCard({ product }) {
  const { addToCart } = useCart()
  const ritual = getRitual(product.ritual)

  return (
    <article className="card">
      {/* CSS-variabel per kort: bakgrunden får ritualens färg */}
      <Link to={`/product/${product.id}`} className="card-media" style={{ '--tint': ritual.colors.bg }}>
        {product.badge && <span className="badge">{product.badge}</span>}
        <ProductImage product={product} />
      </Link>
      <div className="card-body">
        <p className="eyebrow">{ritual.name}</p>
        <h3 className="card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="price">
          {formatPrice(product.price)} <span className="muted size">· {product.size}</span>
        </p>
      </div>
      <button className="btn btn-dark card-btn" onClick={() => addToCart(product)}>
        Add to bag
      </button>
    </article>
  )
}

export default ProductCard
