<script setup lang="ts">
const post = await useContentPage('posts')
const { t } = useI18n()
const localePath = useLocalePath()
const site = useSiteConfig()

const authors = post.authors.map(a => a.name).join(', ')
useSchemaOrg([defineArticle({
  '@type': 'ScholarlyArticle',
  'headline': post.title,
  'description': post.description,
  'abstract': post.abstract,
  'inLanguage': post.locale,
  'datePublished': post.datePublished,
  'dateModified': post.dateModified ?? post.datePublished,
  'keywords': post.tags,
  'author': post.authors.map(a => ({ '@type': 'Person', 'name': a.name, 'url': a.url ?? site.url })),
})])
</script>

<template>
  <article>
    <SiteBreadcrumbs :items="[{ label: t('a11y.home'), to: localePath('/') }, { label: 'Blog', to: localePath('/blog') }, { label: post.title }]" />
    <header>
      <p v-if="post.draft">
        <strong>{{ t('post.draft') }}</strong>
      </p>
      <h1>{{ post.title }}</h1>
      <p class="meta">
        {{ t('post.by') }} {{ authors }}
      </p>
      <p class="meta">
        {{ t('post.published') }} <time :datetime="post.datePublished">{{ formatDate(post.datePublished, post.locale) }}</time>
        <template v-if="post.dateModified">
          · {{ t('post.updated') }} <time :datetime="post.dateModified">{{ formatDate(post.dateModified, post.locale) }}</time>
        </template>
        · {{ t('post.readingTime', { minutes: post.readingMinutes }) }}
      </p>
      <ul
        v-if="post.tags?.length"
        class="link-list"
        :aria-label="t('post.tags')"
      >
        <li
          v-for="tag in post.tags"
          :key="tag"
        >
          <NuxtLink :to="localePath(`/blog/tag/${slugify(tag)}`)">
            {{ tag }}
          </NuxtLink>
        </li>
      </ul>
    </header>

    <section aria-labelledby="abstract-heading">
      <h2 id="abstract-heading">
        {{ t('post.abstract') }}
      </h2>
      <p>{{ post.abstract }}</p>
    </section>
    <section aria-labelledby="plain-summary-heading">
      <h2 id="plain-summary-heading">
        {{ t('post.plainLanguageSummary') }}
      </h2>
      <p>{{ post.plainLanguageSummary }}</p>
    </section>

    <TableOfContents
      v-if="(post.body.toc?.links.length ?? 0) >= 3"
      :links="post.body.toc!.links"
    />
    <ContentRenderer :value="post" />

    <section
      v-if="post.bibliography"
      aria-labelledby="references-heading"
    >
      <h2 id="references-heading">
        {{ t('post.references') }}
      </h2>
      <!-- HTML built by citation-js at build time from the post's own .yml; no visitor input reaches it. -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="post.bibliography" />
    </section>
    <section aria-labelledby="how-to-cite-heading">
      <h2 id="how-to-cite-heading">
        {{ t('post.howToCite') }}
      </h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="post.howToCite" />
    </section>
  </article>
</template>
