import { GetServerSideProps } from "next";
import { z } from "zod";
import { useLanyardWs } from "use-lanyard";
import { RotateLoader } from "react-spinners";
import { useThrottle } from "../hooks/throttle";
import { Centered } from "../layouts/centered";
import { useEffect, useState } from "react";

interface Props {
	userId: string;
}

function IndexPage(props: Props) {
	const data = useThrottle(useLanyardWs(props.userId));
	const [, rerender] = useState({});

	useEffect(() => {
		const interval = setInterval(() => {
			rerender({});
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	if (!data) {
		// Loading state
		return (
			<div>
				<RotateLoader color="white" />
			</div>
		);
	}

	if (!data.spotify) {
		return null;
	}

	const total = data.spotify.timestamps.end - data.spotify.timestamps.start;
	const progress = 100 - (100 * (data.spotify.timestamps.end - new Date().getTime())) / total;

	return (
		<div className="w-full p-1 h-full">
			<div className="flex space-x-8 bg-black/60 border-2 border-neutral-800 p-4 rounded-xl h-full">
				<div className="flex-shrink-0">
					<img src={data.spotify.album_art_url} className="h-full aspect-square rounded-xl" />
				</div>

				<div className="flex flex-col justify-center space-y-4 w-full">
					<div className="space-y-2">
						<p className="text-5xl font-bold truncate w-full">{data.spotify.song}</p>
						<p className="text-3xl">{data.spotify.artist}</p>
					</div>

					<div className="pr-6">
						<div className="w-full rounded-full h-3 bg-white/50">
							<div
								className="bg-white/50 h-3 rounded-full transition-all ease-linear will-change-[width] duration-1000"
								style={{ width: `${progress}%` }}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Page(props: Props) {
	return (
		<Centered>
			<IndexPage {...props} />
		</Centered>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
	const schema = z.object({
		id: z.string(),
	});

	const params = schema.parse(ctx.params);

	return {
		props: {
			userId: params.id,
		},
	};
};
