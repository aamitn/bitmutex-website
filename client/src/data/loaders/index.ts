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



// Fetch success-stories on the server
export async function fetchSuccessStories() {
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/success-stories?populate=*`);
  const data = await res.json();

  return data.data.map((story: any) => ({
    uuid: story.id,
    name: story.name,
    content: story.content,
    slug: story.slug,
    industry: story.industry?.name || "Unknown",
    logo: `${API_URL}${story.logo?.url || ""}`,
    glimpses: story.glimpses?.map((glimpse: any) => ({
      url: glimpse.url,
    })) || [],
    casestudy: story.casestudy?.url || null,
    impacts: story.impacts?.map((impact: any) => ({
      name: impact.name,
      description: impact.description,
      icon: impact.icon,
    })) || [],
    stack: story.stack?.map((solution: any) => ({
      name: solution.name,
    })) || [],
    location: story.location?.map((loc: any) => ({
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
    })) || [],
    services: story.services?.map((service: any) => ({
      name: service.name,
      icon: service.icon,
    })) || [],
    websiteurl: story.websiteurl,
  }));
}

export async function fetchSuccessStoryBySlug(slug: string) {
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";
  const res = await fetch(`${API_URL}/api/success-stories?filters[slug][$eq]=${slug}&populate=*`);
  const data = await res.json();

  if (!data.data.length) return null;

  const story = data.data[0];

  return {
    uuid: story.id,
    name: story.name,
    content: story.content,
    slug: story.slug,
    industry: story.industry?.name || "Unknown",
    logo: story.logo?.url ? `${API_URL}${story.logo.url}` : null,
    glimpses: story.glimpses?.map((glimpse: any) => ({
      url: `${API_URL}${glimpse.url}`,
    })) || [],
    casestudy: `${API_URL}${story.casestudy?.url}`  || null,
    impacts: story.impacts?.map((impact: any) => ({
      name: impact.name,
      description: impact.description,
      icon: impact.icon,
    })) || [],
    stack: story.stack?.map((solution: any) => ({
      name: solution.name,
    })) || [],
    location: story.location?.map((loc: any) => ({
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
    })) || [],
    services: story.services?.map((service: any) => ({
      name: service.name,
    })) || [],
    websiteurl: story.websiteurl,
  };
}


// Fetch projects on the server
export async function fetchProjects() {
  const API_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";
  try {
    const response = await fetch(`${API_URL}/api/projects?populate=*`, { cache: "no-store" });
    const result = await response.json();

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error("Invalid response format");
    }

    return result.data.map((project: any) => ({
      id: project.id,
      name: project.name || "Untitled Project",
      description: project.description?.[0]?.children?.[0]?.text || "No description available.",
      slug: project.slug || "",
      imageUrl: project.image?.formats?.medium?.url
        ? `${API_URL}${project.image.formats.medium.url}`
        : `${API_URL}${project.image?.url || ""}`,
      category: project.category?.text || "Uncategorized",
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function fetchProjectBySlug(slug: string) {
  const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337";

  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/projects?filters[slug][$eq]=${slug}&populate=*`);
    if (!response.ok) {
      throw new Error("Failed to fetch project by slug");
    }

    const data = await response.json();
    console.log("Fetched Project By Slug:", JSON.stringify(data, null, 2));
    console.log("Image is :", JSON.stringify(data.data[0].image.url));

    if (!data.data.length) return null;

    const project = data.data[0];

    return {
      id: project.id,
      name: project.name || "Untitled Project",
      description: project.description || "",
      details: project.details || "",
      imageUrl: project.image?.url
        ? `${STRAPI_BASE_URL}${project.image.url}`
        : null,
      category: project.category?.text || "Uncategorized",
      repourl: project.repourl || null,
      hostedurl: project.hostedurl || null,
      slug: project.slug || "",
    };
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
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



export async function getProjectBySlug(slug: string, status: string) {
  const project = await sdk.collection("projects").find({
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
  return project;
}