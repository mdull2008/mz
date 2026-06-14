import { toggleFollowAction } from "@/lib/actions";

type FollowButtonProps = {
  username: string;
  isFollowing: boolean;
};

export default function FollowButton({ username, isFollowing }: FollowButtonProps) {
  return (
    <form action={toggleFollowAction.bind(null, username)}>
      <button
        type="submit"
        className={isFollowing ? "btn-secondary text-sm" : "btn-primary text-sm"}
      >
        {isFollowing ? "Отписаться" : "Подписаться"}
      </button>
    </form>
  );
}
