import Audio from "./AudioPlayer";

export default function Music() {
  return (
    <div className="bg-[#FCFFE0] min-h-screen">
      <div className="bg-[#BACD92] h-20 md:h-24 flex justify-center items-center w-full text-3xl md:text-5xl z-50 font-semibold">
        Name's Room
      </div>

      <div className="py-4 px-8 flex flex-col items-center justify-center">
        <div className="w-full flex justify-center">
          <img
            src="/baby-music.svg"
            className="w-30 h-30 z-50"
            alt="Baby Music"
          />
        </div>

        <div className="bg-[#E4FFE0] mt-4 w-fit p-4 md:p-8 flex flex-col justify-center items-center gap-8 md:w-3/4">
          <div className="flex flex-wrap gap-8 justify-center items-center">
            <Audio title="Audio 1" link="baby-lullaby.mp3" />
            <Audio title="Audio 2" link="baby-lullaby.mp3" />
            <Audio title="Audio 3" link="baby-lullaby.mp3" />
            <Audio title="Audio 4" link="baby-lullaby.mp3" />
          </div>
        </div>
        <button className="bg-red-500 my-4 text-white p-4 rounded-lg w-36">
          Disconnect
        </button>
      </div>
    </div>
  );
}
