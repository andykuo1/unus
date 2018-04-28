class Serializer
{
  encode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = propertyData;
  }

  decode(serializer, propertyName, propertyData, syncOpts, dst)
  {
    dst[propertyName] = propertyData;
  }
}

export default Serializer;
