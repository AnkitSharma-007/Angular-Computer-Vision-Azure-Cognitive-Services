using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ngComputerVision.Models
{
    public class RootObject
    {
        public string status { get; set; }

        public RecognitionResult[] recognitionResults { get; set; }
    }
}
