import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { Intro2 } from "@/app/_components/intro2";
import { Intro3 } from "@/app/_components/intro3";
import { Landing } from "@/app/_components/landing";
import { QuickSignUp } from "@/app/_components/quicksignup";
import { getAllPosts } from "@/lib/api";

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Landing />
        <Intro2 />
        <Intro3 />
        <QuickSignUp />
      </Container>
    </main>
  );
}