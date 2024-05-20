export default function AudioPlayer({ title, link }) {
  return (
    <div className="border border-black w-fit p-4 flex flex-col rounded-lg gap-2">
      <p>{title}</p>

      <audio src={link} controls />
    </div>
  );
}
