<script setup lang="ts">
// One page of the blog listing (newest first) with its pagination links. Used by /blog/ and /blog/page/<n>/.
const props = defineProps<{ page: number }>()
const { locale } = useI18n()
const perPage = useRuntimeConfig().public.postsPerPage

const { data } = await useAsyncData(`posts:${locale.value}:${props.page}`, async () => {
  // Both queries start before any await: queryPosts reads runtime config, which needs the app context.
  const [posts, total] = await Promise.all([
    queryPosts(locale.value).skip((props.page - 1) * perPage).limit(perPage)
      .select('path', 'title', 'description', 'datePublished', 'locale', 'draft').all(),
    queryPosts(locale.value).count(),
  ])
  return { posts, total }
})
const totalPages = Math.max(1, Math.ceil((data.value?.total ?? 0) / perPage))
if (props.page > totalPages) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
</script>

<template>
  <PostList
    :posts="data?.posts ?? []"
    :heading-level="2"
  />
  <BlogPagination
    :page="page"
    :total-pages="totalPages"
  />
</template>
