import MallCard from '../MallCard';

export default function MallCardExample() {
  return (
    <div className="max-w-sm">
      <MallCard
        id={1}
        name="イオンモール幕張新都心"
        prefecture="千葉県"
        address="千葉県千葉市美浜区豊砂1-1"
        openingDate="2013年12月20日"
        visitCount={5}
        lastVisit="2024年10月15日"
        onIncrement={() => console.log('Increment clicked')}
        onDecrement={() => console.log('Decrement clicked')}
      />
    </div>
  );
}
