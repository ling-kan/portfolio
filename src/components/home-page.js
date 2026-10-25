import React, { useEffect } from 'react'
import get from 'lodash/get'
import Layout from './layout'
import HomeHero from './home-hero'
import Section from './section'
import AboutSection from './about-section'
import ContactCta from './contact-cta'
import LogoStrip from './logo-strip'
import ValuePillars from './value-pillars'
import ImageReel from './image-reel'
import KeyMetrics from './key-metrics'
import SkillsPanel from './skills-panel'
import Resume from './resume'
import ArticlePreview from './article-preview'
import Testimonials from './testimonials'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'

const HomePage = (props) => {
  const posts = get(props, 'data.allContentfulBlogPost.nodes', [])
  const [author = {}] = get(props, 'data.allContentfulLanding.nodes', [])
  const timeline = get(props, 'data.allContentfulTimeline.nodes', [])
  const education = get(props, 'data.allContentfulEducation.nodes', [])
  const headers = get(props, 'data.allContentfulSectionHeader.nodes', [])
  const pillars = get(props, 'data.allContentfulValuePillar.nodes', [])
  const testimonials = get(props, 'data.allContentfulTestimonial.nodes', [])
  const settings = author || {}
  const hash = props.location?.hash
  const reduceMotion = useSafeReducedMotion()

  useEffect(() => {
    if (!hash) return undefined
    const id = setTimeout(
      () =>
        document
          .querySelector(hash)
          ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }),
      500,
    )
    return () => clearTimeout(id)
  }, [hash, reduceMotion])

  const getSection = (key) => {
    const entry = headers.find((h) => h.key === key) || {}
    return {
      eyebrow: entry.eyebrow,
      title: entry.title,
      highlight: entry.highlightWords?.length ? entry.highlightWords : undefined,
      intro: entry.intro,
      buttonLabel: entry.buttonLabel,
    }
  }

  const visiblePosts = posts.filter((p) => !p.hiddenPage)
  const skillNames = (author.skills || []).flatMap((s) =>
    (s.skills || []).map((k) => k.name),
  )

  let n = 0
  const next = () => String(++n).padStart(2, '0')

  const about = getSection('about')
  const impact = getSection('impact')
  const expertise = getSection('expertise')
  const experience = getSection('experience')
  const learning = getSection('education')
  const work = getSection('work')
  const quotes = getSection('testimonials')
  const contact = getSection('contact')

  return (
    <Layout location={props.location} fullHeaderHeight={true} author={author}>
      <div id="bio" />
      <HomeHero
        name={author.name}
        animatedList={author.animatedList}
        image={author.image}
        tagline={author.tagline}
        marqueeItems={skillNames.length ? skillNames : author.animatedList}
        primaryCta={settings.heroPrimaryCtaLabel}
        secondaryCta={settings.heroSecondaryCtaLabel}
        availability={settings.availability}
        cvUrl={settings.cvFile?.url}
      />

      {author.bio?.childMarkdownRemark?.html && (
        <Section
          id="about"
          number={next()}
          eyebrow={about.eyebrow}
          title={about.title}
          highlight={about.highlight}
          intro={about.intro}
        >
          <AboutSection
            html={author.bio.childMarkdownRemark.html}
            image={settings.aboutImage?.gatsbyImageData}
            imageAlt={settings.aboutImage?.description}
            caption={settings.aboutImageCaption}
          />
          <ValuePillars items={pillars} label={settings.valuePillarsLabel} />
        </Section>
      )}

      <ImageReel posts={visiblePosts} />

      {author.keyMetrics?.length > 0 && (
        <Section
          id="impact"
          tone="dark"
          number={next()}
          eyebrow={impact.eyebrow}
          title={impact.title}
          highlight={impact.highlight}
          intro={impact.intro}
          className="overflow-hidden"
          backdrop={
            <div
              aria-hidden="true"
              className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-mint/10 blur-[120px] pointer-events-none"
            />
          }
        >
          <KeyMetrics list={author.keyMetrics} />
          {author.keyAchievementsText && (
            <div className="mt-16 max-w-4xl">
              <p className="eyebrow text-paper/65 mb-6">{settings.achievementsLabel}</p>
              <div
                className="rich-text lead text-paper/80 [&_strong]:!text-paper [&_li]:mb-3"
                dangerouslySetInnerHTML={{ __html: author.keyAchievementsText }}
              />
            </div>
          )}
        </Section>
      )}

      {author.skills?.length > 0 && (
        <Section
          id="skills"
          number={next()}
          eyebrow={expertise.eyebrow}
          title={expertise.title}
          highlight={expertise.highlight}
          intro={expertise.intro}
        >
          <SkillsPanel list={author.skills} image={settings.skillImage?.gatsbyImageData} />
        </Section>
      )}

      <div id="resume" />
      {timeline.length > 0 && (
        <Section
          id="experience"
          tone="sand"
          number={next()}
          eyebrow={experience.eyebrow}
          title={experience.title}
          highlight={experience.highlight}
          intro={experience.intro}
        >
          <LogoStrip items={timeline} label={settings.logoStripLabel} />
          <Resume timeline={timeline} idPrefix="experience" />
        </Section>
      )}

      {education.length > 0 && (
        <Section
          id="education"
          tone="sand"
          number={next()}
          eyebrow={learning.eyebrow}
          title={learning.title}
          highlight={learning.highlight}
          intro={learning.intro}
          className="!pt-0"
        >
          <Resume timeline={education} idPrefix="education" />
        </Section>
      )}

      {visiblePosts.length > 0 && (
        <Section
          id="portfolio"
          number={next()}
          eyebrow={work.eyebrow}
          title={work.title}
          highlight={work.highlight}
          intro={work.intro}
        >
          <ArticlePreview posts={posts} limit={settings.featuredProjectCount} />
        </Section>
      )}

      {testimonials.length > 0 && (
        <Section
          id="testimonials"
          tone="sand"
          number={next()}
          eyebrow={quotes.eyebrow}
          title={quotes.title}
          highlight={quotes.highlight}
          intro={quotes.intro}
        >
          <Testimonials items={testimonials} />
        </Section>
      )}

      <ContactCta
        number={next()}
        eyebrow={contact.eyebrow}
        title={contact.title}
        highlight={contact.highlight}
        intro={contact.intro}
        buttonLabel={contact.buttonLabel}
        image={settings.contactImage?.gatsbyImageData}
        imageAlt={settings.contactImage?.description}
        availability={settings.availability}
      />
    </Layout>
  )
}

export default HomePage