import React, { useEffect, useState } from 'react';
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import { GatsbyImage } from 'gatsby-plugin-image'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import Seo from '../components/seo'
import Layout from '../components/layout'
import BlogHeader from '../components/blog-header'
import * as styles from './blog-post.module.scss'
import { navigate } from "gatsby"
import { isLoggedIn } from "../services/auth"
import Container from '../components/container'
import Loader from '../components/loader'
import ImageZoom, { ImageZoomContent } from '../components/image-zoom'
import { Reveal } from '../components/motion/reveal'

// Tags that should never be shown to visitors. Kept in Contentful for the
// automation scripts, hidden from the UI.
const HIDDEN_TAGS = new Set(['ai-improved']);

const visibleTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag) => !HIDDEN_TAGS.has(tag));
};

const BlogPostTemplate = (props) => {
  const post = get(props, 'data.contentfulBlogPost')
  const previous = get(props, 'data.previous')
  const next = get(props, 'data.next')
  const navigation = get(props, "data.allContentfulNavigation.nodes");
  const socials = get(props, "data.allContentfulSocials.nodes");
  const [loader, setLoader] = useState(true);

  function checkLogin() {
    if (post?.protectPage && !isLoggedIn()) {
      navigate("/login")
      return null
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    checkLogin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {
        loader ?
          <Loader />
          :
          <Layout location={props.location} navigation={navigation} socials={socials} >
            <Seo
              title={post.title}
              description={post.description.childMarkdownRemark.excerpt}
              image={post.heroImage?.resize?.src ? `http:${post.heroImage.resize.src}` : undefined}
            />
            <BlogHeader
              eyebrow="Case study"
              title={post.title}
              content={post.description?.childMarkdownRemark?.excerpt}
              rawDate={post.rawDate}
              endDate={post.endDate}
              timeToRead={post.body?.childMarkdownRemark?.timeToRead || post.content?.childMarkdownRemark?.timeToRead}
              tags={visibleTags(post.tags)}
            />
            <Container className="py-16 md:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <aside className="lg:col-span-3">
                  <div className="lg:sticky lg:top-28 space-y-6">
                    <Link to="/#portfolio" className="group inline-flex items-center gap-2 text-sm font-medium !text-ink">
                      <ArrowLeftIcon className="w-4 h-4 no-fill fill-ink group-hover:-translate-x-1 transition-transform" />
                      All work
                    </Link>
                    {post.role && (
                      <div className="pt-6 border-t border-line">
                        <p className="eyebrow !text-[0.7rem] text-ink/75">Role</p>
                        <p className="mt-1 font-medium text-ink">{post.role}</p>
                      </div>
                    )}
                    {post.endDate && (
                      <div className="pt-6 border-t border-line">
                        <p className="eyebrow !text-[0.7rem] text-ink/75">Duration</p>
                        <p className="mt-1 font-medium text-ink">{post.startDate ? `${post.startDate} – ${post.endDate}` : post.endDate}</p>
                      </div>
                    )}
                  </div>
                </aside>

                <div className="lg:col-span-9">
                  {post.summary?.childMarkdownRemark?.html && (
                    <section className="relative rounded-[1.5rem] bg-ink text-paper p-8 md:p-12 mb-16 overflow-hidden">
                      <div aria-hidden="true" className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/25 blur-3xl" />
                      <p className="relative eyebrow text-accent">Executive summary</p>
                      <ImageZoomContent
                        className="relative rich-text lead mt-6 text-paper/85 [&_strong]:!text-paper"
                        html={post.summary.childMarkdownRemark.html}
                      />
                    </section>
                  )}

                  <ImageZoomContent
                    className={styles.article}
                    html={post.content?.childMarkdownRemark?.html}
                  />
                  {post.heroImage?.gatsbyImageData && (
                    <Reveal className={`${styles.featuredImage} mt-16`}>
                      <ImageZoom image={post.heroImage.gatsbyImageData} alt={post.title}>
                        <GatsbyImage
                          image={post.heroImage.gatsbyImageData}
                          alt={post.title}
                          className="w-full h-full"
                          imgClassName="object-cover"
                        />
                      </ImageZoom>
                    </Reveal>
                  )}
                </div>
              </div>
            </Container>

            {(previous || next) && (
              <nav aria-label="More case studies" className="border-t border-line">
                <Container>
                  <ul className="grid grid-cols-1 md:grid-cols-2 p-0 m-0">
                    {previous && (
                      <li className="list-none md:border-r border-line">
                        <Link to={`/portfolio/${previous.slug}`} rel="prev" className="group block py-10 md:py-14 md:pr-10 !text-ink">
                          <span className="eyebrow text-ink/75 inline-flex items-center gap-2">
                            <ArrowLeftIcon className="w-3.5 h-3.5 no-fill fill-accent group-hover:-translate-x-1 transition-transform" /> Previous
                          </span>
                          <span className="block mt-3 display-md !text-[clamp(1.4rem,2.4vw,2rem)] group-hover:text-accent transition-colors">{previous.title}</span>
                        </Link>
                      </li>
                    )}
                    {next && (
                      <li className={`list-none ${previous ? '' : 'md:col-start-2'} border-t md:border-t-0 border-line`}>
                        <Link to={`/portfolio/${next.slug}`} rel="next" className="group block py-10 md:py-14 md:pl-10 text-right !text-ink">
                          <span className="eyebrow text-ink/75 inline-flex items-center gap-2">
                            Next <ArrowRightIcon className="w-3.5 h-3.5 no-fill fill-accent group-hover:translate-x-1 transition-transform" />
                          </span>
                          <span className="block mt-3 display-md !text-[clamp(1.4rem,2.4vw,2rem)] group-hover:text-accent transition-colors">{next.title}</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </Container>
              </nav>
            )}
          </Layout>
      }
    </>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $slug: String!
    $previousPostSlug: String
    $nextPostSlug: String
  ) {
    contentfulBlogPost(slug: { eq: $slug }) {
      slug
      protectPage
      title
      author {
        name
      }
      startDate(formatString: "MMMM YYYY")
      endDate(formatString: "MMMM YYYY")
      rawDate: endDate
      heroImage {
        gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED, width: 1000)
        resize(height: 630, width: 1200) {
          src
        }
      }
      content {
        childMarkdownRemark {
          html
          tableOfContents(heading: "")
          timeToRead
        }
      }
      tags
      description {
        childMarkdownRemark {
          excerpt
        }
      }
      summary {
        childMarkdownRemark {
          html
        }
      }
      role
    }
    previous: contentfulBlogPost(slug: { eq: $previousPostSlug }) {
      slug
      title
    }
    next: contentfulBlogPost(slug: { eq: $nextPostSlug }) {
      slug
      title
    }
    allContentfulSocials {
      nodes {
        url
        type
      }
    }
    allContentfulNavigation(sort: { fields: [order], order: ASC }) {
      nodes {
        title
        url
        order
      }
    }
  }
`