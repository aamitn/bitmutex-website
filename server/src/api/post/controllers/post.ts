/**
 * post controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::post.post", ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    // Fetch the post
    const post = await strapi.entityService.findOne("api::post.post", id, { populate: "*" });

    if (!post) {
      return ctx.notFound("Post not found");
    }

    // Ensure TypeScript recognizes the `views` field
    const currentViews = (post as { views?: number }).views || 0;

    // Increment views count
    const updatedPost = await strapi.entityService.update("api::post.post", id, {
      data: { views: currentViews + 1 } as Partial<Record<string, unknown>>, // ✅ Fix the type issue
    });

    return updatedPost;
  },
}));
