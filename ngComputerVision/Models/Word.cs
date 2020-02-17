using System.Collections.Generic;

namespace ngComputerVision.Models
{
    public class Word
    {
        public List<int> BoundingBox { get; set; }
        public string Text { get; set; }
    }
}
