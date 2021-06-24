// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Runtime.CompilerServices;
using NodaTime;
using NodaTime.Text;

namespace Sample
{
    public class Test
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Hello World From C#");
        }

        [MethodImpl(MethodImplOptions.NoInlining)]
        public static string GetDate(int extraMins)
        {
            // Instant represents time from epoch
            Instant now = SystemClock.Instance.GetCurrentInstant();

            // Convert an instant to a ZonedDateTime
            ZonedDateTime utc = now.InUtc();

            // Add some extra time
            ZonedDateTime future = utc.PlusMinutes(extraMins);

            var date = $"{future.Date} {future.Hour}:{future.Minute}";

            Console.WriteLine($"C# NodaTime (from NuGet) test \t- Time in {extraMins} minutes is {date}");

            return date;
        }
    }
}