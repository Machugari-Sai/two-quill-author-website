import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiFeather,
  FiBookOpen,
  FiInstagram,
  FiMail,
  FiShoppingBag,
} from 'react-icons/fi'
import authorPhoto from './assets/author/author-photo.jpeg'
import sheBackground from './assets/backgrounds/she-was-the-friend-bg.jpg'
import sheBack from './assets/books/she-was-the-friend-back.png'
import sheFront from './assets/books/she-was-the-friend-front.png'
import loveBackground from './assets/backgrounds/what-love-reveals-bg.jpg'
import loveBack from './assets/books/what-love-reveals-back.png'
import loveFront from './assets/books/what-love-reveals-front.png'

const emailAddress = 'trinath.reddy.106@gmail.com'
const instagramUrl = 'https://www.instagram.com/two_quill_stories/'
const siteUrl = 'https://twoquillstories.com'

const philosophyText =
  'I believe every emotion carries a story worth telling. Through my writing, I hope to explore friendship, love, personal growth, and the moments that quietly shape who we become. My goal is not just to tell stories, but to create experiences that stay with readers long after the final page.'

const books = [
  {
    id: 'she-was-the-friend-i-dreamed-for',
    path: '/books/she-was-the-friend-i-dreamed-for',
    title: 'She Was The Friend I Dreamed For',
    status: 'Available now',
    genre: 'Friendship and emotional fiction',
    front: sheFront,
    back: sheBack,
    description:
      "She Was The Friend I Dreamed For is a heartfelt journey through friendship, loyalty, distance, memories, and the emotions that remain long after conversations end.\n\nThe book explores what it truly means to find someone who understands you beyond words. Through reflections, life lessons, and meaningful moments, it reminds readers that genuine friendship is one of life's greatest gifts.\n\nIf you have ever cherished a friend, missed someone who changed your life, or wondered what true friendship really means, this book was written for you.",
    links: [
      {
        label: 'Buy on Amazon',
        href: 'https://www.amazon.in/She-Was-Friend-I-Dreamed/dp/B0GZSHS3NV/',
      },
      {
        label: 'Buy on Pothi',
        href: 'https://store.pothi.com/book/yashwanth-reddy-she-was-friend-i-dreamed/',
      },
    ],
  },
  {
    id: 'what-love-reveals',
    path: '/books/what-love-reveals',
    title: 'What Love Reveals',
    status: 'Available now',
    genre: 'Love, reflection, and personal growth',
    front: loveFront,
    back: loveBack,
    description:
      'What Love Reveals is a thoughtful exploration of love in its many forms.\n\nThe book reflects on how love is often misunderstood and confused with attraction, obsession, dependency, or temporary emotions. It explores friendship, trust, sacrifice, forgiveness, personal growth, and the emotional connections that make us human.\n\nWhether readers are searching for answers, healing from the past, or simply trying to understand love more deeply, this book offers a journey of reflection that stays with them long after the final page.',
    featured: true,
    links: [
      { label: 'Buy on Amazon', href: '#', placeholder: true },
      { label: 'Buy on Pothi', href: '#', placeholder: true },
    ],
  },
]

const featuredBook = books.find((book) => book.featured) || books[0]

const timelineItems = [
  { label: 'Published', title: 'She Was The Friend I Dreamed For' },
  { label: 'Published', title: 'What Love Reveals' },
  { label: 'Coming Soon', title: 'Next Story' },
]

function pageTitle(book) {
  return book
    ? `${book.title} | Two Quill Stories`
    : 'Two Quill Stories | Machugari Yashwanth Reddy'
}

function routeTitle(pathname) {
  if (pathname === '/books') return 'Library | Two Quill Stories'
  if (pathname === '/author') {
    return 'About Author | Machugari Yashwanth Reddy'
  }
  if (pathname === '/contact') return 'Connect | Two Quill Stories'
  return 'Two Quill Stories | Machugari Yashwanth Reddy'
}

function routeDescription(pathname) {
  if (pathname === '/books') {
    return 'Explore the official Two Quill Stories book library by Machugari Yashwanth Reddy.'
  }
  if (pathname === '/author') {
    return 'Meet Machugari Yashwanth Reddy, Indian author, B.Tech student, and founder of Two Quill Stories.'
  }
  if (pathname === '/contact') {
    return 'Connect with Two Quill Stories through Instagram or email.'
  }
  return 'Two Quill Stories is the official author website of Machugari Yashwanth Reddy, featuring heartfelt books about friendship, love, reflection, and personal growth.'
}

function pageDescription(book) {
  return book
    ? `${book.title} by Machugari Yashwanth Reddy. ${book.genre}.`
    : null
}

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function paragraphs(text, className = 'mt-5 leading-8 text-slate-600') {
  return text.split('\n\n').map((line) => (
    <p className={className} key={line}>
      {line}
    </p>
  ))
}

function PageTransition({ children }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SEO() {
  const location = useLocation()
  const slug = location.pathname.startsWith('/books/')
    ? location.pathname.split('/').filter(Boolean).at(-1)
    : ''
  const book = books.find((item) => item.id === slug)
  const title = book ? pageTitle(book) : routeTitle(location.pathname)
  const description = pageDescription(book) || routeDescription(location.pathname)
  const canonicalUrl = `${siteUrl}${location.pathname}`

  useEffect(() => {
    const upsertMeta = (selector, attributes) => {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        document.head.appendChild(element)
      }
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value)
      })
    }

    document.title = title
    upsertMeta('meta[name="description"]', {
      content: description,
      name: 'description',
    })
    upsertMeta('meta[property="og:title"]', {
      content: title,
      property: 'og:title',
    })
    upsertMeta('meta[property="og:description"]', {
      content: description,
      property: 'og:description',
    })
    upsertMeta('meta[property="og:type"]', {
      content: book ? 'book' : 'website',
      property: 'og:type',
    })
    upsertMeta('meta[property="og:url"]', {
      content: canonicalUrl,
      property: 'og:url',
    })
    upsertMeta('meta[name="twitter:card"]', {
      content: 'summary_large_image',
      name: 'twitter:card',
    })

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    let structuredData = document.head.querySelector('#structured-data')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.id = 'structured-data'
      structuredData.type = 'application/ld+json'
      document.head.appendChild(structuredData)
    }
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': book ? 'Book' : 'WebSite',
      author: {
        '@type': 'Person',
        name: 'Machugari Yashwanth Reddy',
      },
      description,
      name: book ? book.title : 'Two Quill Stories',
      url: canonicalUrl,
    })
  }, [book, canonicalUrl, description, title])

  return null
}

function ExternalLink({ children, className, href, isPlaceholder }) {
  return (
    <a
      aria-disabled={isPlaceholder || undefined}
      className={className}
      href={href}
      onClick={
        isPlaceholder
          ? (event) => {
              event.preventDefault()
            }
          : undefined
      }
      rel={isPlaceholder ? undefined : 'noreferrer'}
      target={isPlaceholder ? undefined : '_blank'}
    >
      {children}
    </a>
  )
}

function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  return (
    <motion.div
      className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl`}
      initial="hidden"
      transition={{ duration: 0.6, ease: 'easeOut' }}
      variants={fadeUp}
      viewport={{ once: true, amount: 0.35 }}
      whileInView="visible"
    >
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-600">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 text-lg leading-8 text-slate-600">{subtitle}</p>
      ) : null}
    </motion.div>
  )
}

function Navigation() {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'is-active text-sky-800' : 'text-slate-600'}`

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-sky-100/80 bg-white/90 shadow-[0_10px_34px_rgba(14,116,144,0.08)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <NavLink
          className="group flex min-w-0 items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-950 sm:text-sm"
          to="/"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-700 shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-sky-300 group-hover:bg-white">
            <FiFeather aria-hidden="true" />
          </span>
          <span className="truncate">Two Quill Stories</span>
        </NavLink>
        <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <NavLink className={linkClass} end to="/">
            Home
          </NavLink>
          <NavLink className={linkClass} to="/books">
            Library
          </NavLink>
          <NavLink className={linkClass} to="/author">
            About Author
          </NavLink>
          <NavLink className={linkClass} to="/contact">
            Connect
          </NavLink>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-5 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 sm:px-8 md:hidden">
        <NavLink className={(state) => `${linkClass(state)} whitespace-nowrap`} end to="/">
          Home
        </NavLink>
        <NavLink className={(state) => `${linkClass(state)} whitespace-nowrap`} to="/books">
          Library
        </NavLink>
        <NavLink className={(state) => `${linkClass(state)} whitespace-nowrap`} to="/author">
          About Author
        </NavLink>
        <NavLink className={(state) => `${linkClass(state)} whitespace-nowrap`} to="/contact">
          Connect
        </NavLink>
      </div>
    </nav>
  )
}

function BookSurface({ src, title, side }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[5px] bg-white shadow-[inset_11px_0_20px_rgba(15,23,42,0.16)] [backface-visibility:hidden]">
      <img
        alt={`${title} ${side} cover`}
        className="h-full w-full bg-white object-contain"
        decoding="async"
        loading="lazy"
        src={src}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.2)_0%,transparent_13%,transparent_82%,rgba(255,255,255,0.2)_100%)]" />
    </div>
  )
}

function FrontCover({ book, compact = false }) {
  return (
    <div
      className={`relative mx-auto w-full ${compact ? 'max-w-[220px]' : 'max-w-[270px]'} py-5`}
    >
      <div className="absolute inset-x-8 bottom-4 h-8 rounded-full bg-slate-950/18 blur-2xl" />
      <motion.div
        className="cover-frame relative overflow-hidden rounded-lg border border-white bg-white p-2"
        transition={{ duration: 0.35, ease: 'easeOut' }}
        whileHover={{ y: -8, rotateZ: -1, scale: 1.018 }}
      >
        <img
          alt={`${book.title} front cover`}
          className="aspect-[2/3] w-full rounded-md object-contain"
          decoding="async"
          loading="lazy"
          src={book.front}
        />
        <div className="pointer-events-none absolute inset-2 rounded-md bg-[linear-gradient(90deg,rgba(2,6,23,0.14),transparent_16%,transparent_85%,rgba(255,255,255,0.22))]" />
      </motion.div>
    </div>
  )
}

function StaticBookCover({ book, side = 'front', size = 'large' }) {
  const src = side === 'back' ? book.back : book.front
  const label = side === 'back' ? 'back cover' : 'front cover'
  const maxWidth = size === 'hero' ? 'max-w-[360px]' : 'max-w-[330px]'

  return (
    <motion.div
      className={`relative mx-auto w-full ${maxWidth} py-7`}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -8, rotateZ: -1, scale: 1.018 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
    >
      <div className="absolute inset-x-8 bottom-6 h-9 rounded-full bg-slate-950/18 blur-2xl" />
      <div className="cover-frame relative overflow-hidden rounded-xl border border-white bg-white p-2.5">
        <img
          alt={`${book.title} ${label}`}
          className="aspect-[2/3] w-full rounded-lg object-contain"
          decoding="async"
          loading={size === 'hero' ? 'eager' : 'lazy'}
          src={src}
        />
        <div className="pointer-events-none absolute inset-2.5 rounded-lg bg-[linear-gradient(90deg,rgba(2,6,23,0.12),transparent_16%,transparent_86%,rgba(255,255,255,0.2))]" />
      </div>
    </motion.div>
  )
}

function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 80)
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.hash])

  return null
}

function ThreeDBook({
  autoRotate = false,
  book,
  interactive = true,
  size = 'default',
}) {
  const [flipped, setFlipped] = useState(false)
  const dimensions =
    size === 'hero'
      ? 'h-[410px] w-[273px] sm:h-[540px] sm:w-[360px]'
      : size === 'large'
        ? 'h-[390px] w-[260px] sm:h-[500px] sm:w-[333px]'
        : 'h-[315px] w-[210px] sm:h-[390px] sm:w-[260px]'
  const rotationAnimation = autoRotate
    ? {
        rotateX: [2, 2, 0, 0, 2],
        rotateY: [-8, -8, 180, 180, -8],
      }
    : { rotateY: flipped ? 180 : -8, rotateX: flipped ? 0 : 2 }
  const rotationTransition = autoRotate
    ? {
        duration: 7.5,
        ease: [0.22, 1, 0.36, 1],
        repeat: Infinity,
        times: [0, 0.32, 0.5, 0.82, 1],
      }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }

  return (
    <motion.div
      animate={{ y: [0, -9, 0] }}
      className="group relative mx-auto flex w-full justify-center py-7"
      onHoverEnd={() => {
        if (interactive && !autoRotate) setFlipped(false)
      }}
      onHoverStart={() => {
        if (interactive && !autoRotate) setFlipped(true)
      }}
      transition={{ duration: 6.5, ease: 'easeInOut', repeat: Infinity }}
    >
      <div className="absolute bottom-8 h-9 w-[72%] rounded-full bg-slate-950/18 blur-2xl" />
      <motion.div
        aria-label={`Rotate ${book.title}`}
        className={`relative ${dimensions} [perspective:1600px] ${
          interactive ? 'cursor-pointer outline-none' : ''
        }`}
        onClick={
          interactive ? () => setFlipped((current) => !current) : undefined
        }
        onKeyDown={(event) => {
          if (!interactive) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setFlipped((current) => !current)
          }
        }}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        whileHover={{ y: -7, rotateZ: -1.2, scale: 1.02 }}
        whileTap={{ scale: 0.985 }}
      >
        <motion.div
          animate={rotationAnimation}
          className="absolute inset-0 [transform-style:preserve-3d]"
          transition={rotationTransition}
        >
          <BookSurface side="front" src={book.front} title={book.title} />
          <div className="absolute bottom-0 left-[-14px] top-0 w-7 origin-right rounded-l-[5px] bg-[linear-gradient(90deg,#082f49,#0f5f8c_48%,#dff6ff)] shadow-[inset_-6px_0_14px_rgba(255,255,255,0.24)] [transform:rotateY(-90deg)]" />
          <div className="absolute bottom-1 right-[-10px] top-1 w-5 rounded-r-sm bg-slate-100 shadow-[inset_5px_0_10px_rgba(15,23,42,0.16)] [transform:translateZ(-8px)]" />
          <div className="absolute inset-0 [transform:rotateY(180deg)]">
            <BookSurface side="back" src={book.back} title={book.title} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function BuyButtons({ book, large = false }) {
  return (
    <div className="flex flex-wrap gap-3">
      {book.links.map((link, index) => (
        <ExternalLink
          className={`btn ${
            index === 0 ? 'btn-primary' : 'btn-secondary'
          } ${large ? 'px-7 py-4 text-base' : 'px-4 py-2.5 text-sm'}`}
          href={link.href}
          isPlaceholder={link.placeholder}
          key={`${book.id}-${link.label}`}
        >
          <FiShoppingBag aria-hidden="true" />
          {link.label}
        </ExternalLink>
      ))}
    </div>
  )
}

function AuthorPortrait() {
  return (
    <motion.div
      className="author-portrait relative mx-auto w-full max-w-[420px]"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7, scale: 1.015 }}
    >
      <div className="absolute -inset-5 rounded-[2rem] bg-sky-200/45 blur-3xl" />
      <div className="relative overflow-hidden rounded-[1.4rem] border border-white bg-white p-3 shadow-[0_30px_90px_rgba(14,116,144,0.18)]">
        <img
          alt="Machugari Yashwanth Reddy"
          className="aspect-[4/5] w-full rounded-[1rem] object-cover object-[50%_34%]"
          decoding="async"
          loading="lazy"
          src={authorPhoto}
        />
        <div className="pointer-events-none absolute inset-3 rounded-[1rem] ring-1 ring-inset ring-white/55" />
      </div>
    </motion.div>
  )
}

function HomePage() {
  return (
    <PageTransition>
      <section className="relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-36 sm:px-8 lg:pb-20 lg:pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(56,189,248,0.2),transparent_31%),radial-gradient(circle_at_12%_72%,rgba(186,230,253,0.32),transparent_28%),linear-gradient(180deg,#ffffff_0%,#eff9ff_56%,#ffffff_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,#ffffff)]" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            animate="visible"
            initial="hidden"
            transition={{ duration: 0.75, ease: 'easeOut' }}
            variants={fadeUp}
          >
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-sky-600">
              Official Author Website
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.04] text-slate-950 sm:text-6xl lg:text-7xl">
              Two Quill Stories
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              The official home of Machugari Yashwanth Reddy, where heartfelt
              books, quiet emotions, and reflective storytelling meet in a calm
              editorial space.
            </p>
          </motion.div>
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="hero-books grid items-end gap-5 sm:grid-cols-2"
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          >
            {books.map((book, index) => (
              <Link
                className={`block rounded-xl outline-none transition focus-visible:ring-4 focus-visible:ring-sky-200 ${
                  index === 0 ? 'sm:mt-10' : 'sm:-mb-10'
                }`}
                key={book.id}
                to={book.path}
              >
                <FrontCover book={book} />
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <HomeIntro />
      <FeaturedBooksPreview />
      <QuoteMoment />
      <Footer />
    </PageTransition>
  )
}

function HomeIntro() {
  return (
    <section className="section bg-white">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="text-center"
          initial="hidden"
          transition={{ duration: 0.65 }}
          variants={fadeUp}
          viewport={{ once: true, amount: 0.35 }}
          whileInView="visible"
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-600">
            Author Introduction
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
            Writing from quiet emotion and honest reflection.
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-8 text-slate-600">
            <p>
              I am Machugari Yashwanth Reddy, an Indian author, B.Tech
              student, and the founder of Two Quill Stories.
            </p>
            <p>
              My writing explores friendship, love, personal growth, and the
              feelings people often carry silently.
            </p>
            <p>
              Through my books, I hope to create reflective stories that feel
              calm, meaningful, and close to the reader&apos;s heart.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturedBooksPreview() {
  return (
    <section className="section border-y border-sky-100 bg-[linear-gradient(180deg,#f4fbff_0%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Featured Books"
          subtitle="A quiet preview of the published works from Two Quill Stories."
          title="From the library"
        />
        <motion.div
          className="mt-14 grid gap-8 lg:grid-cols-2"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {books.map((book) => (
            <motion.article
              className="premium-card group relative overflow-hidden p-6 sm:p-7"
              key={book.id}
              variants={fadeUp}
            >
              <div className="relative grid gap-7 xl:grid-cols-[220px_1fr]">
                <Link className="rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-sky-200" to={book.path}>
                  <FrontCover book={book} compact />
                </Link>
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-600">
                    {book.genre}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl leading-tight text-slate-950">
                    {book.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 leading-7 text-slate-600">
                    {book.description.split('\n\n')[0]}
                  </p>
                  <Link className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-sky-800 transition hover:translate-x-1 hover:text-sky-950" to={book.path}>
                    Discover the Book
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function BookLibrary() {
  return (
    <section className="section bg-white pt-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Book Library"
          subtitle="Both published books from Two Quill Stories, presented with their covers, themes, and dedicated pages."
          title="Library"
        />
        <motion.div
          className="mt-14 grid gap-8 lg:grid-cols-2"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          {books.map((book) => (
            <motion.article
              className="premium-card group relative overflow-hidden p-6 sm:p-7"
              key={book.id}
              variants={fadeUp}
            >
              <div className="relative grid gap-7 xl:grid-cols-[245px_1fr]">
                <Link className="rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-sky-200" to={book.path}>
                  <FrontCover book={book} compact />
                </Link>
                <div className="flex flex-col justify-center">
                  <span className="mb-4 inline-flex w-fit rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                    {book.status}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-600">
                    {book.genre}
                  </p>
                  <h3 className="mt-4 font-serif text-3xl leading-tight text-slate-950">
                    {book.title}
                  </h3>
                  <p className="mt-4 line-clamp-4 leading-7 text-slate-600">
                    {book.description.split('\n\n')[0]}
                  </p>
                  <Link className="btn btn-primary mt-7 w-fit px-5 py-3 text-sm" to={book.path}>
                    Discover the Book
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function BooksPage() {
  return (
    <PageTransition>
      <BookLibrary />
      <Footer />
    </PageTransition>
  )
}

function WhyIWrite() {
  return (
    <section className="section border-y border-sky-100 bg-[linear-gradient(180deg,#f4fbff_0%,#ffffff_100%)]">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <SectionHeading
          eyebrow="Why I Write"
          subtitle="Every story begins with a feeling."
          title="Why I Write"
        />
        <motion.div
          className="premium-card p-8 sm:p-10"
          initial="hidden"
          transition={{ duration: 0.6, delay: 0.08 }}
          variants={fadeUp}
          viewport={{ once: true, amount: 0.35 }}
          whileInView="visible"
        >
          <p className="font-serif text-2xl leading-10 text-slate-800 sm:text-3xl">
            {philosophyText}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function QuoteMoment() {
  return (
    <section className="section bg-[linear-gradient(180deg,#ffffff_0%,#f0f9ff_100%)]">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          align="center"
          eyebrow="Quote of the Moment"
          subtitle="A featured line from Two Quill Stories."
          title="Quote of the Moment"
        />
        <motion.figure
          className="premium-card mt-12 p-8 text-center sm:p-12"
          initial="hidden"
          transition={{ duration: 0.65 }}
          variants={fadeUp}
          viewport={{ once: true, amount: 0.35 }}
          whileInView="visible"
        >
          <blockquote className="font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
            "Every story begins with a feeling."
          </blockquote>
          <figcaption className="mt-7 text-sm font-bold uppercase tracking-[0.28em] text-sky-700">
            Two Quill Stories
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

function AuthorSection() {
  return (
    <section className="section border-y border-sky-100 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbff_48%,#ffffff_100%)] pt-36">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <motion.div
          className="lg:sticky lg:top-28"
          initial="hidden"
          transition={{ duration: 0.6 }}
          variants={fadeUp}
          viewport={{ once: true, amount: 0.35 }}
          whileInView="visible"
        >
          <AuthorPortrait />
        </motion.div>
        <motion.div
          className="author-copy max-w-3xl lg:pl-4"
          initial="hidden"
          transition={{ duration: 0.6, delay: 0.08 }}
          variants={fadeUp}
          viewport={{ once: true, amount: 0.35 }}
          whileInView="visible"
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-600">
            About The Author
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
            Machugari Yashwanth Reddy
          </h2>
          <div className="mt-7 space-y-5 text-[1.02rem] leading-8 text-slate-600">
            <p>
              Machugari Yashwanth Reddy is an Indian author, B.Tech student,
              and the founder of{' '}
              <span className="font-semibold text-slate-900">
                Two Quill Stories
              </span>
              , where stories are written with the belief that every emotion
              deserves to be understood.
            </p>
            <p>
              His journey as a writer began with a simple purpose - to give a
              voice to broken friendships, broken hearts, and the quiet
              emotions that many people carry but often struggle to express.
              Inspired by real-life experiences, meaningful relationships, and
              moments of personal reflection, he believes that stories have the
              power to comfort, inspire, and help people see life from a new
              perspective.
            </p>
            <p>
              His first published book,{' '}
              <span className="font-semibold text-slate-900">
                She Was The Friend I Dreamed For
              </span>
              , is a heartfelt tribute to friendship, inspired by his best
              friend, whom he lovingly calls{' '}
              <span className="font-semibold text-slate-900">Sakhi</span> - a
              word that means <em>female best friend</em>. The book explores
              the beauty of genuine friendship, unforgettable memories, and the
              lasting impact one person can have on another&apos;s life.
            </p>
            <p>
              His second book,{' '}
              <span className="font-semibold text-slate-900">
                What Love Reveals
              </span>
              , explores the deeper meaning of love beyond attraction and
              romance, encouraging readers to reflect on trust, understanding,
              forgiveness, personal growth, and the emotions that shape human
              relationships.
            </p>
            <p>
              Beyond nonfiction, Yashwanth also enjoys writing novels,
              including superhero fiction, where imagination meets meaningful
              storytelling. His long-term dream is to become a writer whose
              stories inspire readers across generations, creating worlds and
              characters that leave a lasting impression.
            </p>
            <p>
              When he is not writing, he enjoys spending time in nature,
              observing life&apos;s small moments, and finding inspiration in
              everyday experiences.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
            <figure className="quote-card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">
                Personal Motto
              </p>
              <blockquote className="mt-4 font-serif text-2xl leading-9 text-slate-950">
                &quot;Enjoy life, because every moment has a story waiting to
                be written.&quot;
              </blockquote>
            </figure>
            <figure className="stan-quote p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">
                Favorite Quote
              </p>
              <blockquote className="mt-4 font-serif text-xl leading-8 text-slate-800">
                <em>
                  &quot;The only advice anybody can give is, if you wanna be a
                  writer, keep writing. And read all you can, read
                  everything.&quot;
                </em>
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-slate-500">
                Stan Lee
              </figcaption>
            </figure>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function WritingJourneySection() {
  return (
    <section className="section bg-white">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          align="center"
          eyebrow="Writing Journey"
          subtitle="A focused path built around emotion, reflection, and meaningful relationships."
          title="Writing with feeling"
        />
        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-3"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, amount: 0.25 }}
          whileInView="visible"
        >
          {timelineItems.map((item) => (
            <motion.div className="premium-card p-6" key={item.title} variants={fadeUp}>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-600">
                {item.label}
              </p>
              <h3 className="mt-4 font-serif text-2xl text-slate-950">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function PublishedBooksSection() {
  return (
    <section className="section border-y border-sky-100 bg-[linear-gradient(180deg,#f4fbff_0%,#ffffff_100%)]">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align="center"
          eyebrow="Published Books"
          subtitle="The published works currently featured by Two Quill Stories."
          title="Books by Machugari Yashwanth Reddy"
        />
        <motion.div
          className="mt-12 grid gap-8 md:grid-cols-2"
          initial="hidden"
          variants={stagger}
          viewport={{ once: true, amount: 0.25 }}
          whileInView="visible"
        >
          {books.map((book) => (
            <motion.article className="premium-card p-6" key={book.id} variants={fadeUp}>
              <div className="grid gap-6 sm:grid-cols-[150px_1fr] sm:items-center">
                <Link className="rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-sky-200" to={book.path}>
                  <FrontCover book={book} compact />
                </Link>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-600">
                    {book.status}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight text-slate-950">
                    {book.title}
                  </h3>
                  <p className="mt-4 leading-7 text-slate-600">
                    {book.description.split('\n\n')[0]}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FutureGoalsSection() {
  return (
    <section className="section bg-white">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          className="premium-card p-8 sm:p-10"
          initial="hidden"
          transition={{ duration: 0.65 }}
          variants={fadeUp}
          viewport={{ once: true, amount: 0.35 }}
          whileInView="visible"
        >
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-600">
            Future Writing Goals
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
            Stories that continue to grow with readers.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Yashwanth&apos;s long-term dream is to keep writing stories that
            inspire readers across generations, including novels and superhero
            fiction where imagination meets meaningful storytelling.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function AuthorPage() {
  return (
    <PageTransition>
      <AuthorSection />
      <WhyIWrite />
      <WritingJourneySection />
      <PublishedBooksSection />
      <FutureGoalsSection />
      <Footer />
    </PageTransition>
  )
}

function ContactPage() {
  const connectSections = [
    {
      title: 'Follow My Journey',
      Icon: FiBookOpen,
      paragraphs: [
        'Follow Two Quill Stories to stay updated on new book releases, writing progress, behind-the-scenes moments, and future stories.',
        "Every new chapter begins with an idea, and I'm excited to share that journey with you.",
      ],
    },
  ]

  return (
    <PageTransition>
      <section className="flex min-h-screen items-center bg-[linear-gradient(180deg,#ffffff_0%,#f0f9ff_100%)] px-5 pb-24 pt-36 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <motion.div
            className="mx-auto mb-10 max-w-2xl text-center"
            initial="hidden"
            transition={{ duration: 0.6 }}
            variants={fadeUp}
            viewport={{ once: true, amount: 0.35 }}
            whileInView="visible"
          >
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-600">
              Connect
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
              Reach Two Quill Stories
            </h1>
          </motion.div>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            <motion.a
              className="contact-card"
              href={instagramUrl}
              initial="hidden"
              rel="noreferrer"
              target="_blank"
              transition={{ duration: 0.6, delay: 0.04 }}
              variants={fadeUp}
              viewport={{ once: true, amount: 0.35 }}
              whileInView="visible"
            >
              <FiInstagram aria-hidden="true" />
              <span>Instagram</span>
              <strong>@two_quill_stories</strong>
            </motion.a>
            <motion.a
              className="contact-card"
              href={`mailto:${emailAddress}`}
              initial="hidden"
              transition={{ duration: 0.6, delay: 0.1 }}
              variants={fadeUp}
              viewport={{ once: true, amount: 0.35 }}
              whileInView="visible"
            >
              <FiMail aria-hidden="true" />
              <span>Email</span>
              <strong>{emailAddress}</strong>
            </motion.a>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6">
            {connectSections.map(({ title, Icon, paragraphs }, index) => (
              <motion.article
                className="connect-note-card"
                initial="hidden"
                key={title}
                transition={{ duration: 0.6, delay: 0.16 + index * 0.08 }}
                variants={fadeUp}
                viewport={{ once: true, amount: 0.28 }}
                whileInView="visible"
              >
                <div className="connect-note-icon">
                  <Icon aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif text-3xl leading-tight text-slate-950 sm:text-4xl">
                    {title}
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-slate-600 sm:text-lg">
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

function BookPage() {
  const { slug } = useParams()
  const book = books.find((item) => item.id === slug) || featuredBook
  const related = books.find((item) => item.id !== book.id) || featuredBook
  const pageBackgrounds = {
    'she-was-the-friend-i-dreamed-for': sheBackground,
    'what-love-reveals': loveBackground,
  }
  const pageBackground = pageBackgrounds[book.id]
  const isLoveBook = book.id === 'what-love-reveals'
  const usesStaticCovers =
    book.id === 'she-was-the-friend-i-dreamed-for' || isLoveBook

  return (
    <PageTransition>
      <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-32 sm:px-8">
        {pageBackground ? (
          <>
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-center"
              decoding="async"
              loading="eager"
              src={pageBackground}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.86)_38%,rgba(255,255,255,0.5)_68%,rgba(255,255,255,0.22)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.18)_48%,#ffffff_100%)]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(56,189,248,0.22),transparent_34%),linear-gradient(180deg,#ffffff_0%,#eef9ff_58%,#ffffff_100%)]" />
        )}
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <motion.div
            animate="visible"
            initial="hidden"
            transition={{ duration: 0.65 }}
            variants={fadeUp}
          >
            <Link className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-sky-800 transition hover:-translate-x-1 hover:text-sky-950" to="/books">
              <FiArrowLeft aria-hidden="true" />
              Back to Library
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-600">
              {book.status}
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.04] text-slate-950 sm:text-7xl">
              {book.title}
            </h1>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
              {book.genre}
            </p>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              {book.description.split('\n\n')[0]}
            </p>
            <div className="mt-8">
              <BuyButtons book={book} large />
            </div>
          </motion.div>
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            {usesStaticCovers ? (
              <StaticBookCover book={book} size="hero" />
            ) : (
              <ThreeDBook book={book} size="hero" />
            )}
          </motion.div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {usesStaticCovers ? (
            <StaticBookCover book={book} side="back" />
          ) : (
            <ThreeDBook book={book} size="large" />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-600">
              About This Book
            </p>
            <h2 className="mt-4 font-serif text-4xl text-slate-950 sm:text-5xl">
              A closer look
            </h2>
            {paragraphs(book.description)}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-300">
              Purchase
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              {book.title}
            </h2>
          </div>
          <BuyButtons book={book} large />
        </div>
      </section>

      <section className="section bg-white">
        <div className="premium-card mx-auto grid max-w-7xl gap-10 p-6 lg:grid-cols-[280px_1fr] lg:items-center">
          <Link className="rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-sky-200" to={related.path}>
            <StaticBookCover book={related} />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-600">
              Related Book
            </p>
            <h2 className="mt-4 font-serif text-4xl text-slate-950">
              {related.title}
            </h2>
            <p className="mt-5 max-w-2xl leading-8 text-slate-600">
              {related.description.split('\n\n')[0]}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="btn btn-primary px-5 py-3 text-sm" to={related.path}>
                View Related Book
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link className="btn btn-secondary px-5 py-3 text-sm" to="/books">
                Back to Books
                <FiArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  )
}

function Footer() {
  return (
    <footer className="border-t border-sky-100 bg-white px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-serif text-3xl leading-tight text-slate-950 sm:text-4xl">
          Thank you for visiting Two Quill Stories.
        </p>
        <p className="mt-5 text-lg text-slate-600">
          Every story begins with a feeling.
        </p>
        <p className="mt-5 font-serif text-2xl text-slate-900">
          - Machugari Yashwanth Reddy
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a className="btn btn-secondary px-5 py-3 text-sm" href={instagramUrl} rel="noreferrer" target="_blank">
            <FiInstagram aria-hidden="true" />
            Instagram
          </a>
          <a className="btn btn-secondary px-5 py-3 text-sm" href={`mailto:${emailAddress}`}>
            <FiMail aria-hidden="true" />
            Email
          </a>
        </div>
        <p className="mt-10 text-sm text-slate-500">
          Copyright {'\u00a9'} {new Date().getFullYear()} Two Quill Stories. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route element={<HomePage />} path="/" />
        <Route element={<BooksPage />} path="/books" />
        <Route element={<AuthorPage />} path="/author" />
        <Route element={<ContactPage />} path="/contact" />
        <Route element={<BookPage />} path="/books/:slug" />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fcff] text-slate-800">
      <Navigation />
      <SEO />
      <ScrollToHash />
      <AnimatedRoutes />
    </main>
  )
}

export default App
