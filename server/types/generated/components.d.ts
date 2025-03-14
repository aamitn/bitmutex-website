import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    heading: Schema.Attribute.String;
    icon: Schema.Attribute.Enumeration<
      ['Frame', 'Download', 'Globe', 'Sparkles', 'LayoutPanelLeft', 'Palette']
    >;
    text: Schema.Attribute.Text;
  };
}

export interface ElementsFeature extends Struct.ComponentSchema {
  collectionName: 'components_elements_features';
  info: {
    displayName: 'Feature';
  };
  attributes: {
    description: Schema.Attribute.String;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isPrimary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
  };
}

export interface ElementsPriceCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_price_cards';
  info: {
    description: '';
    displayName: 'Price Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    feature: Schema.Attribute.Component<'elements.feature', true>;
    heading: Schema.Attribute.String;
    link: Schema.Attribute.Component<'elements.link', false>;
    price: Schema.Attribute.String;
    selected: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface LayoutCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_layout_card_grids';
  info: {
    description: '';
    displayName: 'Card Grid';
  };
  attributes: {
    cardItems: Schema.Attribute.Component<'elements.card', true>;
  };
}

export interface LayoutContentWithImage extends Struct.ComponentSchema {
  collectionName: 'components_layout_content_with_images';
  info: {
    displayName: 'Content With Image';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    reverse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    subHeading: Schema.Attribute.String;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    socialLinks: Schema.Attribute.Component<'elements.link', true>;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    description: '';
    displayName: 'Hero';
  };
  attributes: {
    buttonLink: Schema.Attribute.Component<'elements.link', true>;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.Text;
    topLink: Schema.Attribute.Component<'elements.link', false>;
  };
}

export interface LayoutPriceGrid extends Struct.ComponentSchema {
  collectionName: 'components_layout_price_grids';
  info: {
    displayName: 'Price Grid';
  };
  attributes: {
    priceCard: Schema.Attribute.Component<'elements.price-card', true>;
  };
}

export interface LayoutSectionHeading extends Struct.ComponentSchema {
  collectionName: 'components_layout_section_headings';
  info: {
    displayName: 'Section Heading';
  };
  attributes: {
    heading: Schema.Attribute.Text;
    subHeading: Schema.Attribute.String;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutTopNav extends Struct.ComponentSchema {
  collectionName: 'components_layout_top_navs';
  info: {
    description: '';
    displayName: 'Top Nav';
  };
  attributes: {
    cta: Schema.Attribute.Component<'elements.link', false>;
    logoText: Schema.Attribute.String;
    navItems: Schema.Attribute.Component<'elements.link', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.card': ElementsCard;
      'elements.feature': ElementsFeature;
      'elements.link': ElementsLink;
      'elements.price-card': ElementsPriceCard;
      'layout.card-grid': LayoutCardGrid;
      'layout.content-with-image': LayoutContentWithImage;
      'layout.footer': LayoutFooter;
      'layout.hero': LayoutHero;
      'layout.price-grid': LayoutPriceGrid;
      'layout.section-heading': LayoutSectionHeading;
      'layout.top-nav': LayoutTopNav;
    }
  }
}
