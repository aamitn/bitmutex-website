import sdk from "@/lib/sdk";
import test from "node:test";
const PAGE_SIZE = 3;

export async function getGlobalPageData() {
  const landingPage = await sdk.single("global").find({
    populate: {
      topNav: {
        populate: "*",
      },
      footer: {
        populate: "*",
      },
      logo: { // Include the logo field
        populate: "*",
      },
      logowide: { // Include the logo field
        populate: "*",
      },
    },
  });
  return landingPage;
}

export async function getLandingPage() {
  const landingPage = await sdk.single("landing-page").find({
    populate: {
      blocks: {
        on: {
          "layout.hero": {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
              buttonLink: {
                populate: "*",
              },
              topLink: {
                populate: "*",
              },
            },
          },
          "layout.card-grid": {
            populate: "*",
          },
          "layout.section-heading": {
            populate: "*",
          },
          "layout.content-with-image": {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
            },
          },
          "layout.price-grid": {
            populate: {
              priceCard: {
                populate: "*",
              },
            },
          },
          "layout.ckeditor-block": {
            populate: "*",
          },

          "layout.form-next-to-section": {
            populate: "*",
          },

          "layout.regform-next-to-section": {
            populate: "*",
          },

          "layout.brands": {
            populate: {
              logos: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText", "name"],
                  },
                },
              },
            },
          },

          "layout.faq": {
            populate: "*",
          },

          "layout.post-block": {
            populate: "*",
          },
          
          "layout.service-block": {
            populate: "*",
          },

          "layout.testimonials": {
            populate: {
              testimonials: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText", "name"],
                  }
                },
              },
            },
          },
          

        },
      },
    },
  });

  return landingPage;
}

export async function getAllPagesSlugs() {
  const pages = await sdk.collection("pages").find({
    fields: ["slug"],
  });
  return pages;
}

export async function getPageBySlug(slug: string, status: string) {
  const page = await sdk.collection("pages").find({
    populate: {
      blocks: {
        on: {
          "layout.hero": {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
              buttonLink: {
                populate: "*",
              },
              topLink: {
                populate: "*",
              },
            },
          },
          "layout.card-grid": {
            populate: "*",
          },
          "layout.section-heading": {
            populate: "*",
          },
          "layout.content-with-image": {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
            },
          },
          
          "layout.ckeditor-block": {
            populate: "*",
          },

          "layout.form-next-to-section": {
            populate: "*",
          },
          
          "layout.regform-next-to-section": {
            populate: "*",
          },

          "layout.brands": {
            populate: {
              logos: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText", "name"],
                  },
                },
              },
            },
          },

          "layout.faq": {
            populate: "*",
          },

          "layout.post-block": {
            populate: "*",
          },

          "layout.service-block": {
            populate: "*",
          },
          
          "layout.testimonials": {
            populate: {
              testimonials: {
                populate: {
                  image: {
                    fields: ["url", "alternativeText", "name"],
                  }
                },
              },
            },
          },


        },
      },
    },
    filters: {
      slug: slug,
    },
    status: status as "draft" | "published" | undefined,
  });
  return page;
}

export async function getCategories() {
  const categories = await sdk.collection("categories").find({
    fields: ["text", "description"],
  });
  return categories;
}

export async function getBlogPostBySlug(slug: string, status: string) {
  const post = await sdk.collection("posts").find({
    populate: {
      image: {
        fields: ["url", "alternativeText", "name"],
      },
      category: {
        fields: ["text"],
      },
      blocks: {
        on: {
          "blocks.video": {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
            },
          },
          "blocks.text": {
            populate: "*",
          },
        },
      },
    },
    filters: {
      slug: { $eq: slug },
    },
    status: status as "draft" | "published" | undefined,
  });
  return post;
}

// TODO: FIX THE SEARCH QUERY
export async function getBlogPosts(
  page: number,
  queryString: string,
  category: string
) {
  const posts = await sdk.collection("posts").find({
    populate: {
      image: {
        fields: ["url", "alternativeText", "name"],
      },
      category: {
        fields: ["text"],
      },
    },

    // _q: queryString,

    // filters: {
    //   $or: [
    //     { title: { $containsi: queryString } },
    //     { description: { $containsi: queryString } },
    //     { content: { $containsi: queryString } },
    //   ],
    //   ...(category && { category: { text: { $eq: category } } }),
    // },

    filters: {
      title: { $containsi: queryString },
      ...(category && { category: { text: { $eq: category } } }),
    },
    // filters: {
    //   category: category.length !== 0 ? { text: { $eq: category } } : {},
    //   ...(queryString.length !== 0 ? { title: { $containsi: queryString } } : {}),

    //   $or: [
    //     { text: { $eq: category } },
    //     { title: { $containsi: queryString } },
    //     { description: { $containsi: queryString } },
    //     { content: { $containsi: queryString } },
    //   ],

    // },

    pagination: {
      pageSize: PAGE_SIZE,
      page: page,
    },
  });
  return posts;
}


export async function fetchServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/services?populate=*`);
  const data = await res.json();

  return data.data.map((service: any) => ({
    name: service.name,
    description: service.description,
    slug: service.slug,
    icon: service.icon,
    techstacklogos: service.techstacklogos?.map((img: any) => ({
      url: img.url, // Adjusted to directly access 'url'
    })) || [],
    service_items: service.service_items?.map((item: any) => ({
      name: item.name,
      description: item.description,
      icon: item.icon,
    })) || [],
  }));
}


export async function fetchIndustries() {
  const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";
  
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/industries?populate=*`);
    if (!response.ok) {
      throw new Error("Failed to fetch industries");
    }
    const data = await response.json();
    console.log("Fetched Industry Data:", JSON.stringify(data, null, 2)); 
    return data.data.map((industry: any) => ({
      uuid: industry.id,
      name: industry.name,
      description: industry.description,
      details: industry.details,
      icon: industry.icon,
      slug: industry.slug,
      challenges: industry.challenges.map((c: any) => c.name),
      opportunities: industry.opportunities.map((o: any) => o.name),
      solutions: industry.solutions.map((s: any) => s.name),
    }));
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
}


export async function fetchIndustryBySlug(slug: string) {
  const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";
  
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/industries?filters[slug][$eq]=${slug}&populate=*`);
    if (!response.ok) {
      throw new Error("Failed to fetch industry by slug");
    }
    const data = await response.json();
    console.log("Fetched Industry By Slug:", JSON.stringify(data, null, 2));

    if (!data.data.length) return null;

    const industry = data.data[0];

    return {
      uuid: industry.id,
      name: industry.name,
      description: industry.description,
      details: industry.details,
      icon: industry.icon,
      slug: industry.slug,
      challenges: industry.challenges.map((c: any) => ({ name: c.name })),
      opportunities: industry.opportunities.map((o: any) => ({ name: o.name })),
      solutions: industry.solutions.map((s: any) => ({ name: s.name })),
    };
  } catch (error) {
    console.error("Error fetching industry by slug:", error);
    return null;
  }
}