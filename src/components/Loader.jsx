import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loader réutilisable pour les états de chargement.
 * @param {string} [label] - Texte optionnel sous le spinner
 * @param {string} [variant] - 'inline' (dans le flux) | 'block' (centré dans la zone) | 'full' (plein écran / zone complète)
 * @param {object} [style] - Styles additionnels pour le conteneur
 */
const Loader = ({ label = 'Chargement...', variant = 'block', style = {} }) => {
    const baseStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        color: 'var(--muted-foreground)',
        fontSize: '0.875rem',
    };

    const variantStyles = {
        inline: { padding: '0.5rem 0' },
        block: { padding: '3rem 2rem', minHeight: '200px' },
        full: { padding: '4rem 2rem', minHeight: '50vh', width: '100%' },
    };

    return (
        <div
            className="loader-container"
            style={{
                ...baseStyle,
                ...variantStyles[variant],
                ...style,
            }}
            role="status"
            aria-label={label}
        >
            <span className="loader-spin" style={{ display: 'inline-flex', color: 'var(--primary)' }}>
                <Loader2 size={32} />
            </span>
            {label && <span>{label}</span>}
        </div>
    );
};

export default Loader;
