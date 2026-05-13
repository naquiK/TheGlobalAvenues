import { useLocation } from 'react-router-dom';
import {
  AccreditationSkeleton,
  ArticleDetailSkeleton,
  ArticleGridSkeleton,
  CardGridSkeleton,
  DetailSkeleton,
  FormContactSkeleton,
  GalleryGridSkeleton,
  HeroPanelSkeleton,
  ProcessSkeleton,
  ProfileGridSkeleton,
  SplitContentSkeleton,
  StatsGridSkeleton,
  TrackListSkeleton,
} from './SkeletonLayouts';

function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <HeroPanelSkeleton className="min-h-[620px]" />
      <CardGridSkeleton count={6} columns="md:grid-cols-2 lg:grid-cols-3" />
      <GalleryGridSkeleton count={4} withFilters={false} />
    </div>
  );
}

function AboutPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <HeroPanelSkeleton />
      <StatsGridSkeleton />
      <SplitContentSkeleton />
      <CardGridSkeleton count={4} columns="md:grid-cols-2 lg:grid-cols-4" />
      <ProfileGridSkeleton />
    </div>
  );
}

function CollaboratePageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <HeroPanelSkeleton />
      <FormContactSkeleton />
      <ProcessSkeleton count={3} />
    </div>
  );
}

function PortfolioListPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <HeroPanelSkeleton />
      <CardGridSkeleton count={6} image showHeading={false} />
    </div>
  );
}

function OfferingsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <HeroPanelSkeleton />
      <CardGridSkeleton count={6} columns="md:grid-cols-2 xl:grid-cols-3" />
      <TrackListSkeleton count={5} />
    </div>
  );
}

function ServicesPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <HeroPanelSkeleton />
      <CardGridSkeleton count={8} columns="md:grid-cols-2 lg:grid-cols-4" />
      <ProcessSkeleton count={4} />
      <TrackListSkeleton count={5} />
    </div>
  );
}

function NewsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <HeroPanelSkeleton />
      <ArticleGridSkeleton count={2} featured />
      <ProcessSkeleton count={3} />
      <ArticleGridSkeleton count={6} />
    </div>
  );
}

function DefaultPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <HeroPanelSkeleton />
      <CardGridSkeleton count={6} image />
    </div>
  );
}

export default function PageLoader() {
  const { pathname } = useLocation();

  if (pathname === '/') return <HomePageSkeleton />;
  if (pathname === '/about') return <AboutPageSkeleton />;
  if (pathname === '/collaborate') return <CollaboratePageSkeleton />;
  if (pathname === '/portfolio') return <PortfolioListPageSkeleton />;
  if (pathname.startsWith('/portfolio/')) return <DetailSkeleton />;
  if (pathname === '/universities') return <PortfolioListPageSkeleton />;
  if (pathname === '/gallery') return <GalleryGridSkeleton count={6} />;
  if (pathname.startsWith('/gallery/collection/')) return <GalleryGridSkeleton count={6} withFilters={false} />;
  if (pathname === '/news-blog') return <NewsPageSkeleton />;
  if (pathname.startsWith('/news/')) return <ArticleDetailSkeleton />;
  if (pathname === '/what-we-offer') return <OfferingsPageSkeleton />;
  if (pathname.startsWith('/education-program')) return <OfferingsPageSkeleton />;
  if (pathname === '/services') return <ServicesPageSkeleton />;
  if (pathname === '/partners') {
    return (
      <div className="min-h-screen bg-background pt-20">
        <HeroPanelSkeleton />
        <CardGridSkeleton count={4} columns="md:grid-cols-2 lg:grid-cols-4" showHeading={false} />
      </div>
    );
  }
  if (pathname === '/about-accreditation-preview') return <AccreditationSkeleton />;

  return <DefaultPageSkeleton />;
}
