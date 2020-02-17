using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using System.IO;
using Newtonsoft.Json;
using System.Text;
using ngComputerVision.Models;

namespace ngComputerVision.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class OCRController : Controller
    {
        static string subscriptionKey;
        static string endpoint;
        static string uriBase;

        public OCRController()
        {
            subscriptionKey = "b993f3afb4e04119bd8ed37171d4ec71";
            endpoint = "https://ankitocrdemo.cognitiveservices.azure.com/";
            uriBase = endpoint + "vision/v2.1/read/core/asyncBatchAnalyze";
        }

        [HttpPost, DisableRequestSizeLimit]
        public async Task<string> Post()
        {
            StringBuilder sb = new StringBuilder();
            string result = "No data detected";
            try
            {
                if (Request.Form.Files.Count > 0)
                {
                    var file = Request.Form.Files[Request.Form.Files.Count - 1];

                    if (file.Length > 0)
                    {
                        var memoryStream = new MemoryStream();
                        file.CopyTo(memoryStream);
                        byte[] imageFileBytes = memoryStream.ToArray();
                        memoryStream.Flush();

                        result = await ReadTextFromStream(imageFileBytes);
                        RootObject rootObject = JsonConvert.DeserializeObject<RootObject>(result);
                        if (rootObject.status != null && rootObject.status.Equals("Succeeded"))
                        {
                            foreach (Line line in rootObject.recognitionResults[0].Lines)
                            {
                                sb.Append(line.Text);
                                sb.AppendLine();
                            }
                            result = sb.ToString();
                        }
                        else
                        {
                            dynamic errroMessage = JToken.Parse(result);
                            result = errroMessage.error.message;
                        }
                    }
                }
                return result;
            }
            catch
            {
                result = "Error occurred. Try again";
                return result;
            }
        }

        static async Task<string> ReadTextFromStream(byte[] byteData)
        {
            string result;
            try
            {
                HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
                string uri = uriBase;
                HttpResponseMessage response;
                string operationLocation;

                using (ByteArrayContent content = new ByteArrayContent(byteData))
                {
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    response = await client.PostAsync(uri, content);
                }

                if (response.IsSuccessStatusCode)
                    operationLocation = response.Headers.GetValues("Operation-Location").FirstOrDefault();
                else
                {
                    string errorString = await response.Content.ReadAsStringAsync();
                    return errorString;
                }

                string contentString;
                int i = 0;
                do
                {
                    System.Threading.Thread.Sleep(1000);
                    response = await client.GetAsync(operationLocation);
                    contentString = await response.Content.ReadAsStringAsync();
                    ++i;
                }
                while (i < 10 && contentString.IndexOf("\"status\":\"Succeeded\"") == -1);

                if (i == 10 && contentString.IndexOf("\"status\":\"Succeeded\"") == -1)
                {
                    result = "Timeout error.";
                    return result;
                }

                result = JToken.Parse(contentString).ToString();
                return result;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }
}
