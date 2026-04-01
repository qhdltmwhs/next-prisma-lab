"use client"; // 필수

export default function Error({
    error,
    unstable_retry,
}: {
    error: Error;
    unstable_retry: () => void;
}) {
    return (
        <div>
            <p>에러가 발생했습니다: {error.message}</p>
            <button onClick={() => unstable_retry()}>다시 시도</button>
        </div>
    );
}
