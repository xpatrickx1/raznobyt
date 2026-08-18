import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LangContext';
import Image from './Image';
import searchIcon from '@/assets/images/icons/search.svg';
import categories from '../data/categories.json';
import products from '../data/products.js';

export default function SearchBar() {
    const { lang } = useLang();
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowResults(false);
        }
    };

    const filteredProducts = searchQuery.trim()
        ? products.filter(p =>
            p.title.ua.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.title.ru.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
        : [];

    return (
        <div className="navbar__search-wrapper" ref={searchRef}>
            <form className="navbar__search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder={lang === 'ua' ? 'Я шукаю...' : 'Я ищу...'}
                    className="navbar__search-input"
                    value={searchQuery}
                    onChange={e => {
                        setSearchQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                />
                <button type="submit" className="search-submit-btn">
                    <img src={searchIcon} alt="Search" width="20" height="20" style={{ display: 'block' }} loading="lazy" />
                </button>
            </form>

            {showResults && searchQuery.trim().length > 0 && (
                <div className="search-results">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => {
                            const cat = categories.find(c => c.id === p.category);
                            const catSlug = cat ? cat.slug : 'unknown';
                            return (
                                <Link
                                    key={p.id}
                                    to={`/catalog/${catSlug}/${p.slug}/`}
                                    className="search-result-item"
                                    onClick={() => {
                                        setShowResults(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <div className="suggestion-thumbnail">
                                        <Image src={p.images[0]} alt="" className="search-result-img" />
                                    </div>
                                    <div className="search-result-info">
                                        <div className="search-result-title">{lang === 'ua' ? p.title.ua : p.title.ru}</div>
                                        <div className="search-result-cat">
                                            {cat?.title[lang]}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="search-result-empty">
                            {lang === 'ua' ? 'Нічого не знайдено' : 'Ничего не найдено'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
