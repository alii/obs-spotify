import { GetServerSideProps } from "next";
import { z } from "zod";
import { useLanyardWs } from "use-lanyard";
import { RotateLoader } from "react-spinners";
import { useThrottle } from "../hooks/throttle";
import { Centered } from "../layouts/centered";

interface Props {
	userId: string;
}

function IndexPage(props: Props) {
	const data = useThrottle(useLanyardWs(props.userId));

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

	return (
		<div className="w-full p-1 h-full">
			<div className="flex space-x-8 bg-black/50 p-4 rounded-xl h-full">
				<div className="flex-shrink-0">
					<img src={data.spotify.album_art_url} className="h-full aspect-square rounded-xl" />
				</div>

				<div className="flex flex-col justify-center space-y-2">
					<div className="text-5xl font-bold">{data.spotify.song}</div>
					<div className="text-3xl">{data.spotify.artist}</div>
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
